import axios from 'axios'
import ipfs from './utilities/ipfs'

const baseUrl = process.env.ORBIT_URL || `https://test-node.capsule.social/orbit`

export interface INewCommentData {
	content: string
	emotion: string
	timestamp: number
	parentCID: string
	authorID: string
}

export interface ICommentData {
	authorID: string
	cid: string
	timestamp: number
	emotion: string
}

export function createComment(authorID: string, content: string, emotion: string, parentCID: string): INewCommentData {
	return {
		authorID,
		content,
		emotion,
		timestamp: Date.now(),
		parentCID,
	}
}

export function getComment(cid: string): Promise<INewCommentData> {
	return ipfs().getJSONData(cid)
}

export async function sendComment(c: INewCommentData, type: `comment` | `reply`) {
	const cid = await ipfs().sendJSONData(c)
	await axios.post(`${baseUrl}/content/${c.parentCID}/comments`, { cid, data: c, sig: `whatever`, type })
	return cid
}

export async function getCommentsOfPost(parentCID: string, emotion?: string): Promise<ICommentData[]> {
	const res = await axios.get(`${baseUrl}/content/${parentCID}/comments`, {
		params: { ...(emotion ? { emotion } : {}) },
	})
	if (res.data && res.data.data && res.data.data.comments) {
		return res.data.data.comments
	}

	return []
}
