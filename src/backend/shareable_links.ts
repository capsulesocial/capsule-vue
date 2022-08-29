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

export async function createShareableLink(cid: string) {
	const response = await axios.post(`${capsuleServer}/share`, { cid })
	return response.data.data as string
}

export async function getShareableProfileLink(id: string) {
	const response = await axios.get(`${capsuleServer}/u/${id}/url`)
	return response.data.data as string
}
