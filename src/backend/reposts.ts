import axios from 'axios'
import { signContent } from './utilities/keys'
import { Algorithm, IRepostResponse } from './post'
import { nodeUrl } from './utilities/config'
import { uint8ArrayToHexString } from './utilities/helpers'
import ipfs from './utilities/ipfs'

export async function sendRepost(authorID: string, postCID: string, content: string, type: string): Promise<string> {
	const data = {
		authorID,
		timestamp: Date.now(),
		postCID,
		content,
	}

	const signature = await signContent(data)
	if (!signature) {
		throw new Error(`Post signing failed`)
	}

	const cid = await ipfs().sendJSONData(data)
	await axios.post(`${nodeUrl()}/repost`, {
		cid,
		data,
		sig: uint8ArrayToHexString(signature),
		type,
	})

	return cid
}

export interface IRepost {
	authorID: string
	postCID: string
	sig: string
	timestamp: number
	type: `simple` | `quote`
	_id: string
}

export interface IGetRepostsOptions {
	sort?: Algorithm
	offset?: number
	limit?: number
	following?: string
}

export async function getReposts(
	filter: { authorID: string; postCID?: string },
	options: IGetRepostsOptions,
): Promise<IRepostResponse[]> {
	const { sort, offset = 0, limit = 10, following } = options
	if (sort === `FOLLOWING` && !following) {
		throw new Error(`Following not specified`)
	}

	const { data } = await axios.get(`${nodeUrl()}/repost`, {
		params: {
			...filter,
			sort,
			...(following && sort === `FOLLOWING` ? { following } : {}),
			following,
			offset,
			limit,
		},
	})

	return data.data
}
