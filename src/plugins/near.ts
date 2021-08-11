import type { Plugin } from '@nuxt/types'
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$walletLogin: () => null
		$walletLogout: () => null
	}
}

// Run capsule-vue with NEAR testnet for now
const nearConfig = {
	networkId: `testnet`,
	nodeUrl: `https://rpc.testnet.near.org`,
	contractName: process.env.CONTRACT_NAME || `capsule-vue`,
	walletUrl: `https://wallet.testnet.near.org`,
	helperUrl: `https://helper.testnet.near.org`,
	explorerUrl: `https://explorer.testnet.near.org`,
}

let walletConnection: WalletConnection | null = null
let contract: Contract | null = null

async function initContract() {
	if (walletConnection || contract) {
		// Contract already initialised
		return
	}
	// Initialize connection to the NEAR network
	const near = await connect(
		Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig),
	)

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
	// Redirects to wallet login page
	await _walletConnection.requestSignIn(nearConfig.contractName)
}

function walletLogout() {
	const _walletConnection = getWalletConnection()
	_walletConnection.signOut()
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
export { getWalletConnection, getContract }
