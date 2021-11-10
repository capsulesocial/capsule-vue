import axios from 'axios'
import { signContent } from './utilities/keys'
import { capsuleOrbit } from './utilities/config'
import { uint8ArrayToHexString } from './utilities/helpers'

export async function sendPostDeletion(action: `HIDE`, postCID: string, authorID: string) {
	const event = {
		action,
		postCID,
		timestamp: Date.now(),
		authorID,
	}

	const signature = await signContent(event)

	if (!signature) {
		throw new Error(`Post deletion signing failed`)
	}

	await axios.post(`${capsuleOrbit}/posts`, {
		event,
		sig: uint8ArrayToHexString(signature),
	})
}
