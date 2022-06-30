import axios from 'axios'
import { nodeUrl } from './utilities/config'
import ipfs from './utilities/ipfs'
import libsodium from './utilities/keys'
import { ISignedIPFSObject, uint8ArrayToHexString } from './utilities/helpers'

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

export interface ICommentsStats {
	total: number
	positive: number
	neutral: number
	negative: number
	faceStats: Record<string, number>
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

export async function getComment(cid: string): Promise<INewCommentData> {
	const data = await ipfs().getJSONData<ISignedIPFSObject<INewCommentData>>(cid)
	return data.data
}

export async function sendComment(c: INewCommentData, type: `comment` | `reply`) {
	const comment: INewCommentData = {
		content: c.content,
		emotion: c.emotion,
		timestamp: c.timestamp,
		parentCID: c.parentCID,
		authorID: c.authorID,
	}

	const { sig, publicKey } = await libsodium().signContent(comment)

	const data: ISignedIPFSObject<INewCommentData> = {
		data: comment,
		public_key: publicKey,
		sig: uint8ArrayToHexString(sig),
	}

	const cid = await ipfs().sendJSONData(data)
	await axios.post(`${nodeUrl()}/content/${comment.parentCID}/comments`, {
		cid,
		data,
		type,
	})
	return cid
}

export async function getCommentsOfPost(
	parentCID: string,
	offset: number,
	limit: number,
	emotion?: string,
	emotionCategory?: `negative` | `neutral` | `positive`,
): Promise<ICommentData[]> {
	const res = await axios.get(`${nodeUrl()}/content/${parentCID}/comments`, {
		params: { ...(emotion ? { emotion } : {}), ...(emotionCategory ? { emotionCategory } : {}), offset, limit },
	})
	if (res.data && res.data.data && res.data.data.comments) {
		return res.data.data.comments
	}

	return []
}

export async function getCommentsStats(parentCID: string): Promise<ICommentsStats> {
	const res = await axios.get(`${nodeUrl()}/content/${parentCID}/comments/stats`)
	return res.data
}

export async function getCommentsOfUser(authorID: string, offset: number, limit: number): Promise<ICommentData[]> {
	const res = await axios.get(`${nodeUrl()}/profile/${authorID}/comments`, { params: { offset, limit } })

	if (res.data && res.data.data && res.data.data) {
		return res.data.data
	}

	return []
}
