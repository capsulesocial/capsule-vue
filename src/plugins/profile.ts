import type { Plugin } from '@nuxt/types'
import { getContract, getWalletConnection } from './near'

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$getProfileNEAR: (accountId: string) => Promise<string>
		$setProfileNEAR: (cid: string) => Promise<boolean>
	}
}

async function getProfileNEAR(accountId: string) {
	const _contract: any = getContract()
	const profileCID: string = await _contract.getProfile({ accountId })
	return profileCID
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
