import axios from 'axios'

import ipfs from './utilities/ipfs'
import { capsuleOrbit, capsuleServer } from './utilities/config'
import { IRepost } from './reposts'
import { ICommentData } from './comment'
import { encryptData } from './crypto'
import { signContent } from './utilities/keys'
import { uint8ArrayToHexString } from './utilities/helpers'
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

export function createPost(
	title: string,
	subtitle: string | null,
	content: string,
	category: string,
	tags: Tag[],
	authorID: string,
	featuredPhotoCID?: string | null,
	featuredPhotoCaption?: string | null,
	encrypted?: boolean,
): Post {
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
		...(encrypted ? { encrypted } : {}),
	}
}

export async function sendPost(data: Post): Promise<string> {
	let post: Post = data
	let key: string | null = null
	let counter: string | null = null

	if (data.encrypted) {
		;({ data: post, key, counter } = await encryptData(data))
	}

	const signature = await signContent(post)
	if (!signature) {
		throw new Error(`Signature could not be generated`)
	}

	const cid = await ipfs().sendJSONData(post)

	if (data.encrypted) {
		if (!key || !counter) {
			throw new Error(`Unexpected error occurred`)
		}
		await axios.post(`${capsuleServer}/content`, {
			key,
			data: post,
			counter,
			sig: uint8ArrayToHexString(signature),
			cid,
		})
	}

	await axios.post(`${capsuleOrbit}/content`, {
		cid,
		data: post,
		sig: uint8ArrayToHexString(signature),
		type: `post`,
	})

	return cid
}

export function getPost(cid: string): Promise<Post> {
	return ipfs().getJSONData(cid)
}

export interface IGetPostsOptions {
	sort?: Algorithm
	offset?: number
	limit?: number
	following?: string
	reposts?: boolean
}

export interface IGetPostsAndRepostsOptions extends IGetPostsOptions {
	reposts: true
}

export interface IGetPostsOnlyOptions extends IGetPostsOptions {
	reposts?: false
}

export async function getPosts(
	filter: { category?: string; authorID?: string; tag?: string; bookmarkedBy?: string },
	bookmarker: string,
	options: IGetPostsOnlyOptions,
): Promise<IPostResponse[]>
export async function getPosts(
	filter: { category?: string; authorID?: string; tag?: string; bookmarkedBy?: string },
	bookmarker: string,
	options: IGetPostsAndRepostsOptions,
): Promise<IRepostResponse[]>
export async function getPosts(
	filter: { category?: string; authorID?: string; tag?: string; bookmarkedBy?: string },
	bookmarker: string,
	options: IGetPostsOptions,
): Promise<IPostResponse[] | IRepostResponse[]> {
	const { sort, offset = 0, limit = 10, following, reposts } = options
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
			reposts,
			bookmarker,
		},
	})
	return res.data.data
}

export async function getTags(): Promise<string[]> {
	const res = await axios.get(`${capsuleOrbit}/content/tags`)
	return res.data.data
}

export async function getOnePost(cid: string, bookmarker: string): Promise<IPostResponse> {
	const res = await axios.get(`${capsuleOrbit}/content/${cid}`, { params: { bookmarker } })
	return res.data.data
}
