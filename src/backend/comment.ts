import axios from 'axios'
import ipfs from './utilities/ipfs'

const baseUrl = process.env.ORBIT_URL || `https://test-node.capsule.social/orbit`

export interface INewCommentData {
	content: string
	emotion: string
	timestamp: number
	postCID: string
	authorID: string
}

export interface ICommentData {
	authorID: string
	cid: string
	timestamp: number
	emotion: string
}

export function createComment(authorID: string, content: string, emotion: string, postCID: string): INewCommentData {
	return {
		authorID,
		content,
		emotion,
		timestamp: Date.now(),
		postCID,
	}
}

export function getComment(cid: string): Promise<INewCommentData> {
	return ipfs().getJSONData(cid)
}

export async function sendComment(c: INewCommentData) {
	const cid = await ipfs().sendJSONData(c)
	await axios.post(`${baseUrl}/content/${c.postCID}/comments`, { cid, data: c, sig: `whatever`, type: `comment` })
	return cid
}

export async function getCommentsOfPost(postCID: string, emotion?: string): Promise<ICommentData[]> {
	const res = await axios.get(`${baseUrl}/content/${postCID}/comments`, { params: { ...(emotion ? { emotion } : {}) } })
	if (res.data && res.data.data && res.data.data.comments) {
		return res.data.data.comments
	}

	return []
}
