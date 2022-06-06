import axios, { AxiosError } from 'axios'
import { CID } from 'ipfs-core'

import { signContent, verifyContent } from './utilities/keys'
import ipfs from './utilities/ipfs'
import { hexStringToUint8Array, isError, ISignedIPFSObject, uint8ArrayToHexString } from './utilities/helpers'
import { nodeUrl, capsuleServer, sigValidity } from './utilities/config'
import { IRepost } from './reposts'
import { decryptData, encryptAndSignData } from './crypto'
import { getUserInfoNEAR } from './near'
export interface Tag {
	name: string
}

export interface Post {
	authorID: string
	title: string
	subtitle: string | null
	content: string
	category: string
	featuredPhotoCID: string | null
	featuredPhotoCaption: string | null
	timestamp: number
	tags: Tag[]
	encrypted?: boolean
	postImages: Array<string>
	version: string
	lastUpdated: number
}

export interface IRegularPost extends Post {
	encrypted: false
}

export interface IRegularPostDAG extends Omit<Post, `featuredPhotoCID` | `postImages`> {
	encrypted: false
	featuredPhotoCID: CID | null
	postImages: Array<CID>
	version: string
	lastUpdated: number
}

export interface IEncryptedPost extends Post {
	encrypted: true
}

export type RetrievedPost = Omit<Post, `content`> & { _id: string; excerpt: string; wordCount?: number }

export interface IGenericPostResponse {
	post: RetrievedPost
	bookmarked: boolean
	reposted?: string
	bookmarksCount: number
	commentsCount: number
	repostCount: number
	repost?: IRepost
}

export type IPostResponse = Omit<IGenericPostResponse, `repost`>
export type IPostResponseWithHidden = IPostResponse & { hidden: boolean }
export interface IRepostResponse extends IGenericPostResponse {
	repost: IRepost
	deleted: boolean
}

export type Algorithm = `NEW` | `FOLLOWING` | `TOP`
export type Timeframe = `1` | `7` | `30` | `365`

export function createRegularPost(
	title: string,
	subtitle: string | null,
	content: string,
	category: string,
	tags: Tag[],
	authorID: string,
	postImages: Array<string>,
	featuredPhotoCID: string | null,
	featuredPhotoCaption: string | null,
	version: string = `v1`,
	lastUpdated: number = Date.now(),
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
		postImages,
		featuredPhotoCID,
		featuredPhotoCaption,
		encrypted: false,
		version,
		lastUpdated,
	}
}

export function createEncryptedPost(
	title: string,
	subtitle: string | null,
	content: string,
	category: string,
	tags: Tag[],
	authorID: string,
	postImages: Array<string>,
	featuredPhotoCID: string | null,
	featuredPhotoCaption: string | null,
	version: string,
	lastUpdated: number,
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
		postImages,
		featuredPhotoCID,
		featuredPhotoCaption,
		encrypted: true,
		version,
		lastUpdated,
	}
}

export async function sendRegularPost(data: IRegularPost): Promise<string> {
	const { sig, publicKey } = await signContent(data)
	const featuredPhotoCID = data.featuredPhotoCID ? CID.parse(data.featuredPhotoCID) : null
	const postImages = data.postImages.map((imageCID) => CID.parse(imageCID))

	const ipfsData: ISignedIPFSObject<IRegularPostDAG> = {
		data: {
			authorID: data.authorID,
			title: data.title,
			subtitle: data.subtitle,
			content: data.content,
			category: data.category,
			postImages,
			featuredPhotoCID,
			featuredPhotoCaption: data.featuredPhotoCaption,
			timestamp: data.timestamp,
			tags: data.tags,
			encrypted: data.encrypted,
			version: data.version,
			lastUpdated: data.lastUpdated,
		},
		sig: uint8ArrayToHexString(sig),
		public_key: publicKey,
	}

	const cid = await ipfs().sendJSONData(ipfsData)

	const postData: ISignedIPFSObject<IRegularPost> = { data, sig: uint8ArrayToHexString(sig), public_key: publicKey }
	await axios.post(`${nodeUrl()}/content`, {
		cid,
		data: postData,
		type: `post`,
	})

	return cid
}

// TODO: This needs fixing
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

export async function getRegularPost(cid: string): Promise<ISignedIPFSObject<IRegularPost>> {
	const post = await ipfs().getJSONData<ISignedIPFSObject<IRegularPost>>(cid)
	if (!isRegularPost(post.data)) {
		throw new Error(`Post is encrypted`)
	}
	return post
}

// TODO: Fix this
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
		if (err instanceof AxiosError && err.response) {
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
	filter: { category?: string; authorID?: string; tag?: string; bookmarkedBy?: string; timeframe?: Timeframe },
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

export async function getOnePost(cid: string, bookmarker: string): Promise<IPostResponseWithHidden> {
	const res = await axios.get(`${nodeUrl()}/content/${cid}`, { params: { bookmarker } })
	return res.data.data
}

export async function verifyPostAuthenticity(content: ISignedIPFSObject<Post>) {
	try {
		const { publicKey } = await getUserInfoNEAR(content.data.authorID)
		if (uint8ArrayToHexString(publicKey) !== content.public_key) {
			return false
		}
		const verified = verifyContent(content.data, hexStringToUint8Array(content.sig), publicKey)
		return verified
	} catch (err: any) {
		return false
	}
}
