import axios from 'axios'

import { signContent } from './utilities/keys'
import ipfs from './utilities/ipfs'
import { isError, uint8ArrayToHexString } from './utilities/helpers'
import { nodeUrl, capsuleServer, sigValidity } from './utilities/config'
import { IRepost } from './reposts'
import { ICommentData } from './comment'
import { decryptData, encryptAndSignData } from './crypto'
export interface Tag {
	name: string
}

export interface Post {
	authorID: string
	title: string
	subtitle: string | null
	content: string
	category: string
	featuredPhotoCID?: string | null
	featuredPhotoCaption?: string | null
	timestamp: number
	tags: Tag[]
	encrypted?: boolean
	postImages?: Array<string>
}

export interface IRegularPost extends Post {
	encrypted?: false
}

export interface IEncryptedPost extends Post {
	encrypted: true
}

export type RetrievedPost = Omit<Post, `content`> & { _id: string; excerpt: string }

export interface IGenericPostResponse {
	post: RetrievedPost
	comments: ICommentData[]
	bookmarked: boolean
	reposted?: string
	usersParticipating: string[]
	bookmarksCount: number
	repostCount: number
	repost?: IRepost
}

export type IPostResponse = Omit<IGenericPostResponse, `repost`>
export interface IRepostResponse extends IGenericPostResponse {
	repost: IRepost
	deleted: boolean
}

export type Algorithm = `NEW` | `FOLLOWING` | `TOP`

export function createRegularPost(
	title: string,
	subtitle: string | null,
	content: string,
	category: string,
	tags: Tag[],
	authorID: string,
	featuredPhotoCID?: string | null,
	featuredPhotoCaption?: string | null,
	postImages?: Array<string>,
): IRegularPost {
	if (subtitle !== null) {
		subtitle = subtitle.trim()
	}
	return {
		title: title.trim(),
		subtitle,
		content,
		category,
		timestamp: Date.now(),
		tags,
		authorID,
		...(featuredPhotoCID ? { featuredPhotoCID } : {}),
		...(featuredPhotoCaption ? { featuredPhotoCaption } : {}),
		encrypted: false,
		postImages,
	}
}

export function createEncryptedPost(
	title: string,
	subtitle: string | null,
	content: string,
	category: string,
	tags: Tag[],
	authorID: string,
	featuredPhotoCID?: string | null,
	featuredPhotoCaption?: string | null,
): IEncryptedPost {
	if (subtitle !== null) {
		subtitle = subtitle.trim()
	}
	return {
		title: title.trim(),
		subtitle,
		content,
		category,
		timestamp: Date.now(),
		tags,
		authorID,
		...(featuredPhotoCID ? { featuredPhotoCID } : {}),
		...(featuredPhotoCaption ? { featuredPhotoCaption } : {}),
		encrypted: true,
	}
}

export async function sendRegularPost(data: IRegularPost): Promise<string> {
	const { sig, publicKey } = await signContent(data)

	const ipfsData = { data, sig: uint8ArrayToHexString(sig), public_key: publicKey }

	const cid = await ipfs().sendJSONData(ipfsData)
	await axios.post(`${nodeUrl()}/content`, {
		cid,
		data: ipfsData,
		type: `post`,
	})

	return cid
}

export async function sendEncryptedPost(data: IEncryptedPost): Promise<string> {
	const { data: post, key, counter, sig } = await encryptAndSignData(data)

	const cid = await ipfs().sendJSONData(post)
	await axios.post(`${capsuleServer}/content`, { key, data: post, counter, sig, cid })
	await axios.post(`${nodeUrl()}/content`, {
		cid,
		data: post,
		sig,
		type: `post`,
	})

	return cid
}

export async function getRegularPost(cid: string): Promise<IRegularPost> {
	const post: { data: IRegularPost; sig: string; public_key: string } = await ipfs().getJSONData(cid)
	if (!isRegularPost(post.data)) {
		throw new Error(`Post is encrypted`)
	}
	return post.data
}

export async function getEncryptedPost(cid: string, username: string): Promise<IEncryptedPost | { error: string }> {
	const post: Post = await ipfs().getJSONData(cid)
	if (!isEncryptedPost(post)) {
		throw new Error(`Post is not encrypted`)
	}

	const result = await getEncryptionKeys(username, cid)
	if (isError(result)) {
		return result
	}
	const { key, counter } = result
	post.content = await decryptData(post.content, key, counter)
	return post
}

export function isEncryptedPost(post: Post): post is IEncryptedPost {
	return `encrypted` in post && post.encrypted === true
}

export function isRegularPost(post: Post): post is IRegularPost {
	return !post.encrypted
}

async function getEncryptionKeys(username: string, cid: string) {
	const exp = Date.now() + sigValidity
	const { sig } = await signContent({ username, cid, exp })

	try {
		const res = await axios.get<{ key: string; counter: string }>(
			`${capsuleServer}/content/${cid}?username=${username}&sig=${uint8ArrayToHexString(sig)}&exp=${exp}`,
		)
		return res.data
	} catch (err) {
		if (axios.isAxiosError(err) && err.response) {
			return { error: err.response.data.error }
		}
		throw err
	}
}

export interface IGetPostsOptions {
	sort?: Algorithm
	offset?: number
	limit?: number
	following?: string
}

export async function getPosts(
	filter: { category?: string; authorID?: string; tag?: string; bookmarkedBy?: string },
	bookmarker: string,
	options: IGetPostsOptions,
): Promise<IPostResponse[] | IRepostResponse[]> {
	const { sort, offset = 0, limit = 10, following } = options
	if (sort === `FOLLOWING` && !following) {
		throw new Error(`No following provided`)
	}
	const res = await axios.get(`${nodeUrl()}/content`, {
		params: {
			...filter,
			sort,
			...(following && sort === `FOLLOWING` ? { following } : {}),
			offset,
			limit,
			bookmarker,
		},
	})
	return res.data.data
}

export async function getTags(): Promise<string[]> {
	const res = await axios.get(`${nodeUrl()}/content/tags`)
	return res.data.data
}

export async function getOnePost(cid: string, bookmarker: string): Promise<IPostResponse> {
	const res = await axios.get(`${nodeUrl()}/content/${cid}`, { params: { bookmarker } })
	return res.data.data
}
