import type { Plugin } from '@nuxt/types'
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import constants from '../../constants'

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$walletLogin: () => Promise<void>
		$walletLogout: () => void
	}
}

// Run capsule-vue with NEAR testnet for now
const nearConfig = {
	networkId: constants.networkId,
	nodeUrl: constants.nodeUrl,
	contractName: constants.contractName,
	walletUrl: constants.walletUrl,
	helperUrl: constants.helperUrl,
	explorerUrl: constants.explorerUrl,
}

let walletConnection: WalletConnection | null = null
let contract: Contract | null = null

async function initContract() {
	if (walletConnection || contract) {
		// Contract already initialised
		return
	}
	// Initialize connection to the NEAR network
	const near = await connect({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() }, ...nearConfig })

	// Initializing Wallet based Account
	walletConnection = new WalletConnection(near, null)

	// Initializing contract API
	contract = new Contract(walletConnection.account(), nearConfig.contractName, {
		viewMethods: [`getProfile`],
		changeMethods: [`setProfile`],
	})
}

function getContract() {
	if (!contract) {
		throw new Error(`Contract not yet initialised!`)
	}
	return contract
}

function getWalletConnection() {
	if (!walletConnection) {
		throw new Error(`Wallet Connection not yet initialised!`)
	}
	return walletConnection
}

async function walletLogin() {
	const _walletConnection = getWalletConnection()
	if (!_walletConnection.isSignedIn()) {
		// Redirects to wallet login page
		const domain = constants.DOMAIN
		const redirectURL = new URL(`/auth`, domain)
		await _walletConnection.requestSignIn(nearConfig.contractName, undefined, redirectURL.toString())
	}
}

function walletLogout() {
	const _walletConnection = getWalletConnection()
	if (_walletConnection.isSignedIn()) {
		_walletConnection.signOut()
	}
}

const nearPlugin: Plugin = async (_context, inject) => {
	// Initialise contract API
	await initContract()
	// eslint-disable-next-line no-console
	console.log(`Smart Contract API initialised!`)

	inject(`walletLogin`, walletLogin)
	inject(`walletLogout`, walletLogout)
}

export default nearPlugin
export { getWalletConnection, getContract, walletLogout }
