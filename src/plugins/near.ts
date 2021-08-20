import type { Plugin } from '@nuxt/types'
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import { KeyPairEd25519 } from 'near-api-js/lib/utils'
// eslint-disable-next-line camelcase
import { base_decode, base_encode } from 'near-api-js/lib/utils/serialize'

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$walletLogin: () => Promise<void>
		$walletLogout: () => void
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
		const domain = process.env.DOMAIN || `http://localhost:3000`
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

function signedInToWallet() {
	const _walletConnection = getWalletConnection()
	return _walletConnection.isSignedIn()
}

async function getNearPrivateKey() {
	const _walletConnection = getWalletConnection()
	const accountId = _walletConnection.getAccountId()

	const keystore = new keyStores.BrowserLocalStorageKeyStore()
	const keypair = (await keystore.getKey(nearConfig.networkId, accountId)) as KeyPairEd25519

	const privateKey = keypair.secretKey
	const privateKeyBytes = new Uint8Array(base_decode(privateKey))

	return privateKeyBytes
}

async function setNearPrivateKey(privateKey: Uint8Array, accountId: string) {
	try {
		const encodedPrivateKey = base_encode(privateKey)
		const keypair = new KeyPairEd25519(encodedPrivateKey)

		const keystore = new keyStores.BrowserLocalStorageKeyStore()
		await keystore.setKey(nearConfig.networkId, accountId, keypair)
		return true
	} catch {
		// Couldn't set private key in LocalStorage
	}
	return false
}

const nearPlugin: Plugin = async (_context, inject) => {
	// Initialise contract API
	await initContract()
	// eslint-disable-next-line no-console
	console.log(`Smart Contract API initialised!`)

	const _walletConnection = getWalletConnection()
	console.log(`Is Signed in? ${_walletConnection.isSignedIn()}`)

	inject(`walletLogin`, walletLogin)
	inject(`walletLogout`, walletLogout)
}

export default nearPlugin
export {
	getWalletConnection,
	getContract,
	walletLogout,
	signedInToWallet,
	getNearPrivateKey,
	setNearPrivateKey,
	initContract,
}
