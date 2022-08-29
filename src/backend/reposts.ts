/*
 * Copyright (c) 2021-2022 Capsule Social, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */
import axios from 'axios'
import ipfs from '@capsulesocial/ipfs-wrapper'
import libsodium from './utilities/keys'
import { Algorithm, IRepostResponse } from './post'
import { nodeUrl } from './utilities/config'
import { ISignedIPFSObject, uint8ArrayToHexString } from './utilities/helpers'

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
			...(type ? { type } : {}),
		},
	})

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
