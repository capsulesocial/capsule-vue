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
import { nodeUrl } from './utilities/config'
import libsodium from './utilities/keys'
import { uint8ArrayToHexString } from './utilities/helpers'
import cache from './utilities/caching'

export interface IFollowData {
	action: `FOLLOW` | `UNFOLLOW`
	subject: string
	object: string
	timestamp: number
}

export async function followChange(action: `FOLLOW` | `UNFOLLOW`, self: string, user: string) {
	const data: IFollowData = {
		action,
		subject: self,
		object: user,
		timestamp: Date.now(),
	}

	const { sig } = await libsodium().signContent(data)

	await axios.post(`${nodeUrl()}/follow`, {
		event: data,
		sig: uint8ArrayToHexString(sig),
	})
}

async function _getFollowersAndFollowing(user: string): Promise<{ followers: Set<string>; following: Set<string> }> {
	const response = await axios.get(`${nodeUrl()}/follow/${user}`)

	const { followers, following } = response.data.data

	return { followers: new Set(followers), following: new Set(following) }
}

export const getFollowersAndFollowing = cache(_getFollowersAndFollowing)
