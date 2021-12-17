import axios from 'axios'

import { signContent } from './utilities/keys'
import ipfs from './utilities/ipfs'
import { isError, uint8ArrayToHexString } from './utilities/helpers'
import { capsuleOrbit, capsuleServer, sigValidity } from './utilities/config'
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
	usersParticipating: string[]
	bookmarksCount: number
	repostCount: number
	repost?: IRepost
}

export type IPostResponse = Omit<IGenericPostResponse, `repost`>
export interface IRepostResponse extends IGenericPostResponse {
	repost: IRepost
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
	const signature = await signContent(data)
	if (!signature) {
		throw new Error(`Post signing failed`)
	}

	const cid = await ipfs().sendJSONData(data)
	await axios.post(`${capsuleOrbit}/content`, {
		cid,
		data,
		sig: uint8ArrayToHexString(signature),
		type: `post`,
	})

	return cid
}

export async function sendEncryptedPost(data: IEncryptedPost): Promise<string> {
	const { data: post, key, counter, sig } = await encryptAndSignData(data)

	const cid = await ipfs().sendJSONData(post)
	await axios.post(`${capsuleServer}/content`, { key, data: post, counter, sig, cid })
	await axios.post(`${capsuleOrbit}/content`, {
		cid,
		data: post,
		sig,
		type: `post`,
	})

	return cid
}

export async function getRegularPost(cid: string): Promise<IRegularPost> {
	const post: Post = await ipfs().getJSONData(cid)
	if (!isRegularPost(post)) {
		throw new Error(`Post is encrypted`)
	}
	return post
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
	const signature = await signContent({ username, cid, exp })
	if (!signature) {
		throw new Error(`Content signing failed`)
	}
	const sig = uint8ArrayToHexString(signature)

	try {
		const res = await axios.get<{ key: string; counter: string }>(
			`${capsuleServer}/content/${cid}?username=${username}&sig=${sig}&exp=${exp}`,
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
	const res = await axios.get(`${capsuleOrbit}/content`, {
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

export async function getAmountOfContent(authorID: string): Promise<{ totalPosts: number }> {
	const res = await axios.get(`${capsuleOrbit}/content/${authorID}?totalPosts=true`)
	return res.data
}

export async function getTags(): Promise<string[]> {
	const res = await axios.get(`${capsuleOrbit}/content/tags`)
	return res.data.data
}

export async function getOnePost(cid: string, bookmarker: string): Promise<IPostResponse> {
	const res = await axios.get(`${capsuleOrbit}/content/${cid}`, { params: { bookmarker } })
	return res.data.data
}
