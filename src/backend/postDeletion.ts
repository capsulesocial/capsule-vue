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
import libsodium from './utilities/keys'
import { nodeUrl } from './utilities/config'
import { uint8ArrayToHexString } from './utilities/helpers'

export async function sendPostDeletion(action: `HIDE`, postCID: string, authorID: string) {
	const event = {
		action,
		postCID,
		timestamp: Date.now(),
		authorID,
	}

	const { sig } = await libsodium().signContent(event)

	await axios.post(`${nodeUrl()}/posts`, {
		event,
		sig: uint8ArrayToHexString(sig),
	})
}
