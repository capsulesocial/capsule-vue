import axios from 'axios'

import { signContent } from './keys'
import ipfs from './ipfs'

import { Post } from '@/interfaces/Post'
import { Tag } from '@/interfaces/Tag'

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

	const cid = await ipfs().sendPost(data)
	axios.post(`https://test-node.capsule.social/orbit/content`, {
		cid,
		data,
		sig: Buffer.from(signature).toString(`hex`),
		type: `post`,
	})

	return cid
}

export function getPost(cid: string): Promise<Post> {
	return ipfs().getPost(cid)
}
