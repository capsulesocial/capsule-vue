import axios from 'axios'
import { nodeUrl } from './utilities/config'
import ipfs from './utilities/ipfs'
import { signContent } from './utilities/keys'
import { uint8ArrayToHexString } from './utilities/helpers'

export interface INewCommentData {
	content: string
	emotion: string
	timestamp: number
	parentCID: string
	authorID: string
}

export interface ICommentData {
	authorID: string
	_id: string
	timestamp: number
	parentCID: string
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
	const comment: INewCommentData = {
		content: c.content,
		emotion: c.emotion,
		timestamp: c.timestamp,
		parentCID: c.parentCID,
		authorID: c.authorID,
	}

	const { sig } = await signContent(comment)

	const cid = await ipfs().sendJSONData(comment)
	await axios.post(`${nodeUrl()}/content/${comment.parentCID}/comments`, {
		cid,
		data: comment,
		sig: uint8ArrayToHexString(sig),
		type,
	})
	return cid
}

export async function getCommentsOfPost(
	parentCID: string,
	emotion?: string,
	emotionCategory?: `negative` | `neutral` | `positive`,
): Promise<ICommentData[]> {
	const res = await axios.get(`${nodeUrl()}/content/${parentCID}/comments`, {
		params: { ...(emotion ? { emotion } : {}), ...(emotionCategory ? { emotionCategory } : {}) },
	})
	if (res.data && res.data.data && res.data.data.comments) {
		return res.data.data.comments
	}

	return []
}

export async function getCommentsOfUser(authorID: string, offset: number, limit: number): Promise<ICommentData[]> {
	const res = await axios.get(`${nodeUrl()}/profile/${authorID}/comments`, { params: { offset, limit } })

	if (res.data && res.data.data && res.data.data) {
		return res.data.data
	}

	return []
}
