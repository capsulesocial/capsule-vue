import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import { KeyPairEd25519 } from 'near-api-js/lib/utils'
// eslint-disable-next-line camelcase
import { base_decode, base_encode } from 'near-api-js/lib/utils/serialize'
import { getNearConfig, domain } from './utilities/config'

const nearConfig = getNearConfig()

let _walletConnection: WalletConnection | null = null
let _contract: Contract | null = null

export async function initContract() {
	// Initialize connection to the NEAR network
	const near = await connect({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() }, ...nearConfig })

	// Initializing Wallet based Account
	_walletConnection = new WalletConnection(near, null)

	// Initializing contract API
	_contract = new Contract(_walletConnection.account(), nearConfig.contractName, {
		viewMethods: [`getUserInfo`],
		changeMethods: [`setUserInfo`],
	})
}

export function getContract() {
	if (!_contract) {
		throw new Error(`Contract not yet initialised!`)
	}
	return _contract
}

export function getWalletConnection() {
	if (!_walletConnection) {
		throw new Error(`Wallet Connection not yet initialised!`)
	}
	return _walletConnection
}

export async function walletLogin() {
	const walletConnection = getWalletConnection()
	if (!walletConnection.isSignedIn()) {
		// Redirects to wallet login page
		const redirectURL = new URL(`/`, domain)
		await walletConnection.requestSignIn(nearConfig.contractName, undefined, redirectURL.toString())
	}
}

export function walletLogout() {
	const walletConnection = getWalletConnection()
	if (walletConnection.isSignedIn()) {
		walletConnection.signOut()
	}
}

export function signedInToWallet() {
	const walletConnection = getWalletConnection()
	return walletConnection.isSignedIn()
}

export async function getNearPrivateKey() {
	const walletConnection = getWalletConnection()
	const accountId = walletConnection.getAccountId()

	const keystore = new keyStores.BrowserLocalStorageKeyStore()
	const keypair = (await keystore.getKey(nearConfig.networkId, accountId)) as KeyPairEd25519

	const privateKey = keypair.secretKey
	const privateKeyBytes = new Uint8Array(base_decode(privateKey))

	return privateKeyBytes
}

export async function setNearPrivateKey(privateKey: Uint8Array, accountId: string) {
	const encodedPrivateKey = base_encode(privateKey)
	const keypair = new KeyPairEd25519(encodedPrivateKey)

	const keystore = new keyStores.BrowserLocalStorageKeyStore()
	await keystore.setKey(nearConfig.networkId, accountId, keypair)
	return true
}

export async function removeNearPrivateKey() {
	const walletConnection = getWalletConnection()
	const accountId = walletConnection.getAccountId()

	const keystore = new keyStores.BrowserLocalStorageKeyStore()
	await keystore.removeKey(nearConfig.networkId, accountId)
}

export async function getUserPublicKey(username: string) {
	const contract = getContract() as any
	const userInfo: null | [string, string] = await contract.getUserInfo({ username })
	if (!userInfo) {
		throw new Error(`Username not found on NEAR!`)
	}
	// Base58 decode the public key
	// Return it as a Uint8Array
	return new Uint8Array(base_decode(userInfo[1]))
}

export async function setUserInfoNEAR(username: string) {
	const contract = getContract() as any
	const walletConnection = getWalletConnection()
	if (walletConnection.isSignedIn()) {
		// TODO: use separate return values when \
		// length of username is less than minimum or \
		// greater than maximum length allowed
		const status: 1 | 2 | 3 = await contract.setUserInfo({ username })
		if (status === 1) {
			return { success: true, error: `` }
		}
		if (status === 2) {
			return { success: false, error: `Username length invalid!` }
		}
		if (status === 3) {
			return { success: false, error: `Username already exists!` }
		}
		throw new Error(`Unknown status encountered while updating info on NEAR`)
	}
	throw new Error(`Not signed-in to wallet yet!`)
}
