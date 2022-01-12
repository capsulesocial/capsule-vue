import axios from 'axios'
import { signContent } from './utilities/keys'
import { nodeUrl } from './utilities/config'
import { uint8ArrayToHexString } from './utilities/helpers'
import { IPostResponse } from './post'

export async function sendBookmarkEvent(action: `ADD` | `REMOVE`, authorID: string, postCID: string) {
	const event = { action, authorID, postCID, timestamp: Date.now() }

	const signature = await signContent(event)
	if (!signature) {
		throw new Error(`Bookmark signing failed`)
	}

	await axios.post(`${nodeUrl()}/bookmark`, { event, sig: uint8ArrayToHexString(signature) })
}

export async function isPostBookmarkedByUser(postCID: string, userID: string): Promise<boolean> {
	const response = await axios.get(`${nodeUrl()}/bookmark/${userID}/${postCID}`)

	return response.data.data.isBookmarked
}

export async function getBookmarksOfUser(userID: string, category?: string): Promise<IPostResponse[]> {
	const response = await axios.get(`${nodeUrl()}/bookmark/${userID}`)

	const bookmarks: IPostResponse[] = response.data.data.bookmarks

	if (category) {
		return bookmarks.filter((p) => p.post.category === category)
	}

	return bookmarks
}
