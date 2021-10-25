import axios from 'axios'
import { resolveUsername } from './server'
import { getContract, getWalletConnection } from './near'

import ipfs from './utilities/ipfs'
import cache from './utilities/caching'
import { capsuleOrbit } from './utilities/config'

export interface Profile {
	id: string
	name: string
	email: string
	bio: string
	location: string
	avatar: string
	socials: string[]
}

export async function getProfileNEAR(username: string) {
	const contract = getContract() as any
	const { success, accountId } = await resolveUsername(username)
	if (success) {
		const profileCID: string = await contract.getProfile({ accountId })
		return { success, profileCID }
	}
	return { success: false, profileCID: `` }
}

export function loadProfileFromIPFS(cid: string) {
	return ipfs().getJSONData<Profile>(cid)
}

export const getProfile = cache(_getProfile)

export async function setProfile(p: Profile) {
	const cid = await _addProfileToIPFS(p)
	const res = await sendProfileServer(cid, p)
	if (!res.success) {
		throw new Error(`Profile didn't update on the server!`)
	}
	const profileSet = await _setProfileNEAR(cid)
	if (!profileSet) {
		throw new Error(`Profile didn't update on NEAR!`)
	}

	return cid
}

export async function sendProfileServer(cid: string, data: Profile): Promise<{ success: boolean; cid: string }> {
	try {
		const response = await axios.post(`${capsuleOrbit}/profile`, { cid, data })
		if (response.data.success) {
			return { success: true, cid: response.data.cid }
		}
		throw new Error(`Failed to send Profile`)
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(error)
	}
	return { success: false, cid: `` }
}

async function _setProfileNEAR(cid: string) {
	const contract = getContract() as any
	const walletConnection = getWalletConnection()
	if (walletConnection.isSignedIn()) {
		await contract.setProfile({ cid })
		return true
	}

	return false
}

function _addProfileToIPFS(content: Profile) {
	return ipfs().sendJSONData(content)
}

async function _getProfile(authorID: string) {
	const res = await getProfileNEAR(authorID)
	if (res.success) {
		return loadProfileFromIPFS(res.profileCID)
	}

	throw new Error(`Error finding profile!`)
}
