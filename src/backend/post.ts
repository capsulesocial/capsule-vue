import axios from 'axios'

import { signContent } from './utilities/keys'
import ipfs from './utilities/ipfs'
import { uint8ArrayToHexString } from './utilities/helpers'
import { capsuleOrbit } from './utilities/config'
import { IRepost } from './reposts'
import { ICommentData } from './comment'
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
	timestamp: number
	tags: Tag[]
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
	}
}

export async function sendPost(data: Post): Promise<string> {
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
