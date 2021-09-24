import axios from 'axios'
import { signContent } from './keys'
import { Algorithm } from './post'
import { capsuleOrbit } from './utilities/config'
import { uint8ArrayToHexString } from './utilities/helpers'
import ipfs from './utilities/ipfs'

export async function sendRepost(authorID: string, postCID: string, content: string): Promise<string> {
	const data = {
		authorID,
		timestamp: Date.now(),
		postCID,
		content,
	}

	const signature = signContent(data, authorID)
	if (!signature) {
		throw new Error(`Post signing failed`)
	}

	const cid = await ipfs().sendJSONData(data)
	await axios.post(`${capsuleOrbit}/repost`, {
		cid,
		data,
		sig: uint8ArrayToHexString(signature),
		type: `simple`,
	})

	return cid
}

export async function getReposts(
	authorID: string,
	sort: Algorithm = `NEW`,
	postCID?: string,
	following?: string,
): Promise<string[]> {
	if (sort === `FOLLOWING` && !following) {
		throw new Error(`Following not specified`)
	}

	const { data } = await axios.get(`${capsuleOrbit}/repost`, {
		params: {
			authorID,
			sort,
			following,
			postCID,
		},
	})
	return data.data.map((cid: string) => cid)
}
