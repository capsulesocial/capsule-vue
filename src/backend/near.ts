import { Account, connect, Contract, keyStores, Near, providers } from 'near-api-js'
import { KeyPairEd25519 } from 'near-api-js/lib/utils'
// eslint-disable-next-line camelcase
import { base_decode, base_encode } from 'near-api-js/lib/utils/serialize'
import { getNearConfig } from './utilities/config'

export interface INearConfig {
	networkId: `testnet` | `mainnet` | `betanet` | `local`
	nodeUrl: string
	contractName: string
	walletUrl: string
	helperUrl: string
	explorerUrl: string
}

export interface ILocalNetNearConfig extends Omit<INearConfig, `explorerUrl` | `helperUrl`> {
	networkId: `local`
	keyPath: string
}

const nearConfig = getNearConfig()

let _near: Near | null = null
let _contract: Contract | null = null

function getRpcProviderUrl() {
	switch (nearConfig.networkId) {
		case `mainnet`:
		case `testnet`:
		case `betanet`:
			return `https://rpc.${nearConfig.networkId}.near.org`
		case `local`:
			return nearConfig.nodeUrl
		default:
			throw new Error(`Invalid NEAR network type`)
	}
}

const provider = new providers.JsonRpcProvider(getRpcProviderUrl())

export async function getUsernameNEAR(accountId: string): Promise<string | null> {
	const rawResult = await provider.query({
		request_type: `call_function`,
		account_id: nearConfig.contractName,
		method_name: `getUsername`,
		args_base64: Buffer.from(JSON.stringify({ accountId })).toString(`base64`),
		finality: `optimistic`,
	})

	if (`result` in rawResult) {
		// format result
		// res = [accountId, base58_encode_public_key]
		const res = JSON.parse(Buffer.from((rawResult as any).result).toString())
		return res
	}

	throw new Error(`Error in contract`)
}

export async function initContract(accountId: string) {
	// Initialize connection to the NEAR network
	_near = await connect({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() }, ...nearConfig })
	// Initializing contract API
	_contract = new Contract(new Account(_near.connection, accountId), nearConfig.contractName, {
		viewMethods: [`getUserInfo`, `getUsername`],
		changeMethods: [`setUserInfo`],
	})
}

export function getContract() {
	if (!_contract) {
		throw new Error(`Contract not yet initialised!`)
	}
	return _contract
}

export async function getNearPrivateKey() {
	if (!_contract) {
		throw new Error(`Contract not yet initialised!`)
	}
	const accountId = _contract.account.accountId

	const keystore = new keyStores.BrowserLocalStorageKeyStore()
	const keypair = (await keystore.getKey(nearConfig.networkId, accountId)) as KeyPairEd25519

	const privateKey = keypair.secretKey
	const privateKeyBytes = new Uint8Array(base_decode(privateKey))

	return privateKeyBytes
}

export async function getNearPublicKey(accountId?: string) {
	if (!accountId) {
		if (!_contract) {
			throw new Error(`Contract not yet initialised!`)
		}
		accountId = _contract.account.accountId
	}
	const keystore = new keyStores.BrowserLocalStorageKeyStore()
	const keypair = (await keystore.getKey(nearConfig.networkId, accountId)) as KeyPairEd25519 | null

	if (!keypair) {
		return null
	}
	const publicKey = keypair.publicKey.data
	return publicKey
}

export async function setNearPrivateKey(privateKey: Uint8Array, accountId: string) {
	const encodedPrivateKey = base_encode(privateKey)
	const keypair = new KeyPairEd25519(encodedPrivateKey)

	const keystore = new keyStores.BrowserLocalStorageKeyStore()
	await keystore.setKey(nearConfig.networkId, accountId, keypair)
	return true
}

export async function removeNearPrivateKey() {
	if (!_contract) {
		throw new Error(`Contract not yet initialised!`)
	}
	const accountId = _contract.account.accountId

	const keystore = new keyStores.BrowserLocalStorageKeyStore()
	await keystore.removeKey(nearConfig.networkId, accountId)
}

export async function getUserInfoNEAR(username: string) {
	const contract = getContract() as any
	const userInfo = (await contract.getUserInfo({ username })) as null | [string, string]
	if (!userInfo) {
		throw new Error(`Username not found on NEAR!`)
	}
	// Base58 decode the public key, return it as a Uint8Array
	const publicKey = new Uint8Array(base_decode(userInfo[1]))
	if (publicKey[0] !== 0 || publicKey.length !== 33) {
		throw new Error(`First element is non-null`)
	}
	return { accountId: userInfo[0], publicKey: publicKey.slice(1) }
}

export async function setUserInfoNEAR(username: string) {
	const contract = getContract() as any
	// TODO: use enums
	const status: 1 | 2 | 3 | 4 | 5 = await contract.setUserInfo({ username })
	switch (status) {
		case 1:
			return { success: true, error: `` }
		case 2:
			return { success: false, error: `Username should contain atleast 3 characters!` }
		case 3:
			return { success: false, error: `Username already exists!` }
		case 4:
			return { success: false, error: `Username should not contain more than 18 characters!` }
		case 5:
			return { success: false, error: `Your NEAR Account is already linked to another username` }
		default:
			throw new Error(`Unknown status encountered while updating info on NEAR`)
	}
}
