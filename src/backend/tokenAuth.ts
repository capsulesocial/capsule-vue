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
import { capsuleServer } from './utilities/config'
import { getExpTimestamp, uint8ArrayToHexString } from './utilities/helpers'
import libsodium from './utilities/keys'

interface ITokenData {
	token: string
	exp: number
}

async function getAuthToken(username: string): Promise<ITokenData> {
	const data = { username, action: `authentication`, exp: getExpTimestamp() }
	const { sig } = await libsodium().signContent(data)
	const response = await axios.post(`${capsuleServer}/auth`, {
		data,
		sig: uint8ArrayToHexString(sig),
	})
	return response.data
}

export async function getToken(username: string, reset = false): Promise<string> {
	try {
		if (reset) {
			throw new Error(`Token to be resetted`)
		}

		const tokenData = localStorage.getItem(`serverAuthToken`)
		if (!tokenData) {
			throw new Error(`No token`)
		}

		const { token, exp }: ITokenData = JSON.parse(tokenData)
		if (Date.now() > exp - 60000) {
			throw new Error(`Token is expired`)
		}

		return token
	} catch (err) {
		const { token, exp } = await getAuthToken(username)
		localStorage.setItem(`serverAuthToken`, JSON.stringify({ token, exp }))
		return token
	}
}
