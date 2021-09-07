import { resolveUsername } from '../plugins/server'

import { getContract, getWalletConnection } from '@/backend/near'

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

export { getProfileNEAR, setProfileNEAR }
