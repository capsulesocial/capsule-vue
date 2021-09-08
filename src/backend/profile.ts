import { resolveUsername, sendProfileServer } from './server'
import ipfs from './ipfs'

import { getContract, getWalletConnection } from '@/backend/near'

export interface Profile {
	id: string
	name: string
	email: string
	bio: string
	location: string
	avatar: string
	socials: string[]
	publicKey: string
}

async function getProfileNEAR(username: string) {
	const contract = getContract() as any
	const { success, accountId } = await resolveUsername(username)
	if (success) {
		const profileCID: string = await contract.getProfile({ accountId })
		return { success, profileCID }
	}
	return { success: false, profileCID: `` }
}

async function setProfileNEAR(cid: string) {
	const contract = getContract() as any
	const walletConnection = getWalletConnection()
	if (walletConnection.isSignedIn()) {
		await contract.setProfile({ cid })
		return true
	}

	return false
}

async function getProfile(authorID: string) {
	const res = await getProfileNEAR(authorID)
	if (res.success) {
		return ipfs().getProfile(res.profileCID)
	}

	throw new Error(`Error finding profile!`)
}

async function setProfile(p: Profile) {
	const cid = await ipfs().sendProfile(p)
	const res = await sendProfileServer(cid, p)
	if (!res.success) {
		throw new Error(`Profile didn't update on the server!`)
	}
	await setProfileNEAR(cid)

	return cid
}

export { getProfileNEAR, setProfileNEAR, getProfile, setProfile }
