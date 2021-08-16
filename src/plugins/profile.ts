import type { Plugin } from '@nuxt/types'
import { getContract, getWalletConnection } from './near'
import { resolveUsername } from './server'

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$getProfileNEAR: (username: string) => Promise<{ success: boolean; profileCID: string }>
		$setProfileNEAR: (cid: string) => Promise<boolean>
	}
}

async function getProfileNEAR(username: string) {
	const _contract: any = getContract()
	const { success, accountId } = await resolveUsername(username)
	if (success === true) {
		const profileCID: string = await _contract.getProfile({ accountId })
		return { success, profileCID }
	}
	return { success: false, profileCID: `` }
}

async function setProfileNEAR(cid: string) {
	const _contract: any = getContract()
	const _walletConnection = getWalletConnection()
	if (_walletConnection.isSignedIn()) {
		await _contract.setProfile(cid)
		return true
	}
	return false
}

const nearProfile: Plugin = (_context, inject) => {
	inject(`getProfileNEAR`, getProfileNEAR)
	inject(`setProfileNEAR`, setProfileNEAR)
}

export default nearProfile
