import axios from 'axios'

import { signContent } from './keys'
import ipfs from './utilities/ipfs'
import { uint8ArrayToHexString } from './utilities/helpers'
import { capsuleOrbit } from './utilities/config'
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

export type RetrievedPost = Omit<Post, `content`> & { _id: string }

export interface IPostResponse {
	post: RetrievedPost
	comments: Comment[]
	usersParticipating: string[]
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
	const signature = signContent(data, data.authorID)
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

export async function getPosts(
	filter: { category?: string; authorID?: string; tag?: string },
	sort?: Algorithm,
	following?: string,
): Promise<IPostResponse[]> {
	if (sort === `FOLLOWING` && !following) {
		throw new Error(`No following provided`)
	}
	const res = await axios.get(`${capsuleOrbit}/content`, {
		params: { ...filter, sort, ...(following && sort === `FOLLOWING` ? { following } : {}) },
	})
	return res.data.data
}

export async function getTags(): Promise<string[]> {
	const res = await axios.get(`${capsuleOrbit}/content/tags`)
	return res.data.data
}
