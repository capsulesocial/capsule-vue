import axios from 'axios'

import { signContent } from './keys'
import ipfs from './utilities/ipfs'
import { uint8ArrayToHexString } from './utilities/helpers'
export interface Tag {
	name: string
}

export interface Post {
	authorID: string
	title: string
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

const baseUrl = process.env.ORBIT_URL || `https://test-node.capsule.social/orbit`

export function createPost(
	title: string,
	content: string,
	category: string,
	tags: Tag[],
	authorID: string,
	featuredPhotoCID?: string | null,
): Post {
	return {
		title: title.trim(),
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
	await axios.post(`${baseUrl}/content`, {
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
): Promise<IPostResponse[]> {
	const res = await axios.get(`${baseUrl}/content`, { params: { ...filter, sort } })
	return res.data.data
}

export async function getTags(): Promise<string[]> {
	const res = await axios.get(`${baseUrl}/content/tags`)
	return res.data.data
}
