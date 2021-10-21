import axios from 'axios'
import { signContent } from './keys'
import { capsuleOrbit } from './utilities/config'
import { uint8ArrayToHexString } from './utilities/helpers'

export async function sendBookmarkEvent(action: `ADD` | `REMOVE`, authorID: string, postCID: string) {
	const event = { action, authorID, postCID, timestamp: Date.now() }

	const signature = signContent(event, authorID)
	if (!signature) {
		throw new Error(`Bookmark signing failed`)
	}

	await axios.post(`${capsuleOrbit}/bookmark`, { event, sig: uint8ArrayToHexString(signature) })
}

export async function isPostBookmarkedByUser(postCID: string, userID: string): Promise<boolean> {
	const response = await axios.get(`${capsuleOrbit}/bookmark/${userID}/${postCID}`)

	return response.data.data.isBookmarked
}
