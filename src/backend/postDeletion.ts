import axios from 'axios'
import { signContent } from './keys'
import { capsuleOrbit } from './utilities/config'
import { uint8ArrayToHexString } from './utilities/helpers'
import ipfs from './utilities/ipfs'

export async function sendPostDeletion(action: `HIDE`, postCID: string, authorID: string): Promise<string> {
	const data = {
		action,
		postCID,
		timestamp: Date.now(),
		authorID,
	}

	const signature = signContent(data, authorID)

	if (!signature) {
		throw new Error(`Post deletion signing failed`)
	}

	const cid = await ipfs().sendJSONData(data)

	await axios.post(`${capsuleOrbit}/posts`, {
		cid,
		data,
		sig: uint8ArrayToHexString(signature),
	})

	return cid
}
