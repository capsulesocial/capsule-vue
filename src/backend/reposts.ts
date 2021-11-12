import axios from 'axios'
import { signContent } from './utilities/keys'
import { Algorithm, RetrievedPost } from './post'
import { capsuleOrbit } from './utilities/config'
import { uint8ArrayToHexString } from './utilities/helpers'
import ipfs from './utilities/ipfs'
import { ICommentData } from './comment'

export async function sendRepost(authorID: string, postCID: string, content: string): Promise<string> {
	const data = {
		authorID,
		timestamp: Date.now(),
		postCID,
		content,
	}

	const signature = await signContent(data)
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

export interface IRepost {
	authorID: string
	postCID: string
	sig: string
	timestamp: number
	type: `simple`
	_id: string
}

export interface IRepostRetrieved {
	repost: IRepost
	post: RetrievedPost
	comments: ICommentData[]
}

export async function getReposts(
	authorID: string,
	sort: Algorithm = `NEW`,
	postCID?: string,
	following?: string,
): Promise<IRepostRetrieved[]> {
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

	return data.data
}
