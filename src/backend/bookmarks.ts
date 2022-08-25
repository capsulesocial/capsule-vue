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
import { IPostResponse } from './post'

export async function sendBookmarkEvent(action: `ADD` | `REMOVE`, authorID: string, postCID: string) {
	const event = { action, authorID, postCID, timestamp: Date.now() }

	const { sig } = await libsodium().signContent(event)

	await axios.post(`${nodeUrl()}/bookmark`, { event, sig: uint8ArrayToHexString(sig) })
}

export async function isPostBookmarkedByUser(postCID: string, userID: string): Promise<boolean> {
	const response = await axios.get(`${nodeUrl()}/bookmark/${userID}/${postCID}`)

	return response.data.data.isBookmarked
}

export type BookmarkSort = `BOOKMARK_ASC` | `BOOKMARK_DESC` | `POST_ASC` | `POST_DESC`

export async function getBookmarksOfUser(
	userID: string,
	category?: string,
	sort: BookmarkSort = `BOOKMARK_DESC`,
	limit = 10,
	offset = 0,
): Promise<IPostResponse[]> {
	const response = await axios.get(`${nodeUrl()}/bookmark/${userID}`, { params: { sort, limit, offset, category } })

	const bookmarks: IPostResponse[] = response.data.data.bookmarks

	if (category) {
		return bookmarks.filter((p) => p.post.category === category)
	}

	return bookmarks
}
