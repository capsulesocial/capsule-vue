import axios from 'axios'
import libsodium from './utilities/keys'
import { Algorithm, IRepostResponse } from './post'
import { nodeUrl } from './utilities/config'
import { ISignedIPFSObject, uint8ArrayToHexString } from './utilities/helpers'
import ipfs from './utilities/ipfs'

export interface IRepost {
	authorID: string
	postCID: string
	sig: string
	timestamp: number
	type: `simple` | `quote`
	_id: string
}

export async function sendRepost(authorID: string, postCID: string, content: string, type: string): Promise<string> {
	const data: Omit<IRepost, `_id` | `sig` | `type`> & { content: string } = {
		authorID,
		timestamp: Date.now(),
		postCID,
		content,
	}

	const { sig, publicKey } = await libsodium().signContent(data)

	const ipfsData: ISignedIPFSObject<Omit<IRepost, `_id` | `sig` | `type`> & { content: string }> = {
		data,
		sig: uint8ArrayToHexString(sig),
		public_key: publicKey,
	}

	const cid = await ipfs().sendJSONData(ipfsData)
	await axios.post(`${nodeUrl()}/repost`, {
		cid,
		data: ipfsData,
		type,
	})

	return cid
}

export interface IGetRepostsOptions {
	sort?: Algorithm
	offset?: number
	limit?: number
	following?: string
	type?: `simple` | `quote`
}

export async function getReposts(
	filter: { authorID?: string; postCID?: string },
	options: IGetRepostsOptions,
): Promise<IRepostResponse[]> {
	const { sort, offset = 0, limit = 10, following, type } = options

	const params: Record<string, any> = {
		...filter,
		sort,
		...(following && sort === `FOLLOWING` ? { following } : {}),
		following,
		offset,
		limit,
	}

	if (type) {
		params.type = type
	}

	if (sort === `FOLLOWING` && !following) {
		throw new Error(`Following not specified`)
	}

	const { data } = await axios.get(`${nodeUrl()}/repost`, { params })

	return data.data
}

export async function getReposters(postCID: string, options: IGetRepostsOptions): Promise<Array<string>> {
	const { sort, offset = 0, limit = 10, following } = options
	if (sort === `FOLLOWING` && !following) {
		throw new Error(`Following not specified`)
	}

	const { data } = await axios.get(`${nodeUrl()}/repost`, {
		params: {
			postCID,
			sort,
			...(following && sort === `FOLLOWING` ? { following } : {}),
			following,
			offset,
			limit,
			duplicate: true,
		},
	})

	const reposts = data.data as Array<IRepostResponse>
	const authorsSet = new Set<string>()
	reposts.forEach((r) => authorsSet.add(r.repost.authorID))
	return Array.from(authorsSet)
}
