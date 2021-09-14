import axios from 'axios'
import { capsuleOrbit } from './utilities/config'
import { signContent } from './keys'
import { uint8ArrayToHexString } from './utilities/helpers'

export interface IFollowData {
	action: `FOLLOW` | `UNFOLLOW`
	subject: string
	object: string
	timestamp: number
}

export async function followChange(action: `FOLLOW` | `UNFOLLOW`, self: string, user: string) {
	const data: IFollowData = {
		action,
		subject: self,
		object: user,
		timestamp: Date.now(),
	}

	const signature = signContent(data, self)

	if (!signature) {
		throw new Error(`Comment signing failed`)
	}

	await axios.post(`${capsuleOrbit}/follow`, {
		event: data,
		sig: uint8ArrayToHexString(signature),
	})
}

let _followerData: { followers: Set<string>; following: Set<string> } | null = null

export async function getFollowersAndFollowing(
	user: string,
): Promise<{ followers: Set<string>; following: Set<string> }> {
	const response = await axios.get(`${capsuleOrbit}/follow/${user}`)

	const { followers, following } = response.data.data

	return { followers: new Set(followers), following: new Set(following) }
}

export async function updateFollowerData(user: string) {
	_followerData = await getFollowersAndFollowing(user)

	return _followerData
}

export async function getFollowerData(user: string) {
	if (!_followerData) {
		_followerData = await getFollowersAndFollowing(user)
	}

	return _followerData
}
