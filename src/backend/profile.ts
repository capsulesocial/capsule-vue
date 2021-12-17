import axios from 'axios'

import ipfs from './utilities/ipfs'
import cache from './utilities/caching'
import { nodeUrl } from './utilities/config'
import { signContent } from './utilities/keys'
import { uint8ArrayToHexString } from './utilities/helpers'

export interface Profile {
	id: string
	name: string
	email: string
	bio: string
	location: string
	avatar: string
	socials: string[]
	background?: string
}

export function createDefaultProfile(id: string): Profile {
	return {
		id,
		name: ``,
		email: ``,
		bio: ``,
		location: ``,
		avatar: ``,
		socials: [],
	}
}

export function loadProfileFromIPFS(cid: string) {
	return ipfs().getJSONData<Profile>(cid)
}

export const getProfile = cache(_getProfile)

export async function setProfile(p: Profile) {
	const [cid, sig] = await Promise.all([addProfileToIPFS(p), signContent(p)])
	if (!sig) {
		throw new Error(`Profile signing failed`)
	}

	const res = await sendProfileServer(cid, p, sig)
	if (!res.success) {
		throw new Error(`Profile didn't update on the server!`)
	}

	return cid
}

export async function sendProfileServer(
	cid: string,
	data: Profile,
	sig: Uint8Array,
): Promise<{ success: boolean; cid: string }> {
	try {
		const response = await axios.post(`${nodeUrl()}/profile`, {
			cid,
			data,
			sig: uint8ArrayToHexString(sig),
		})
		if (response.data.success) {
			return { success: true, cid: response.data.cid }
		}
		throw new Error(`Failed to send Profile`)
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(error)
		return { success: false, cid: `` }
	}
}

export function addProfileToIPFS(content: Profile) {
	return ipfs().sendJSONData(content)
}

async function _getProfile(authorID: string) {
	const response = await axios.get(`${nodeUrl()}/profile/${authorID}`)
	if (response.data.data) {
		return response.data.data.profile as Profile | null
	}
	throw new Error(`Error finding profile!`)
}
