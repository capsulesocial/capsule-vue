import { Account, connect, Contract, keyStores, Near, providers, WalletConnection } from 'near-api-js'
import { KeyPairEd25519 } from 'near-api-js/lib/utils'
import { base_decode as baseDecode, base_encode as baseEncode } from 'near-api-js/lib/utils/serialize'
import { getNearConfig, domain } from './utilities/config'
import { uint8ArrayToHexString } from './utilities/helpers'

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
let _walletConnection: WalletConnection | null = null

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

const provider = new providers.JsonRpcProvider({ url: getRpcProviderUrl() })

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

export async function getIsAccountIdOnboarded(accountId: string): Promise<boolean> {
	const rawResult = await provider.query({
		request_type: `call_function`,
		account_id: nearConfig.contractName,
		method_name: `isAccountOnboarded`,
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

export async function initNear() {
	_near = await connect({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() }, headers: {}, ...nearConfig })
}

export function initWalletConnection() {
	// Initialize connection to the NEAR network
	if (!_near) {
		throw new Error(`NEAR not yet initialised!`)
	}
	_walletConnection = new WalletConnection(_near, null)
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
		const redirectURL = new URL(`/register`, domain)
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

export function initContract(accountId: string) {
	// Initialize connection to the NEAR network
	if (!_near) {
		throw new Error(`NEAR not yet initialised!`)
	}

	// Initializing contract API
	_contract = new Contract(new Account(_near.connection, accountId), nearConfig.contractName, {
		viewMethods: [`getUserInfo`, `validateUsername`],
		changeMethods: [`setUserInfo`],
	})
}

export async function checkAccountStatus(accountId: string) {
	try {
		if (!_near) {
			throw new Error(`NEAR not yet initialised!`)
		}

		const account = await _near.account(accountId)
		const res = await account.getAccountBalance()
		return { balance: res.available }
	} catch (err: any) {
		if (`type` in err && err.type === `AccountDoesNotExist`) {
			return { balance: `0` }
		}
		throw err
	}
}

function getContract() {
	if (!_contract) {
		throw new Error(`Contract not yet initialised!`)
	}
	return _contract
}

export async function getNearPrivateKey(nearAccountId?: string) {
	let accountId: string | null = null

	if (nearAccountId) {
		accountId = nearAccountId
	} else if (_contract) {
		accountId = _contract.account.accountId
	} else {
		throw new Error(`Contract not yet initialised!`)
	}

	const keystore = new keyStores.BrowserLocalStorageKeyStore()
	const keypair = (await keystore.getKey(nearConfig.networkId, accountId)) as KeyPairEd25519 | null

	if (!keypair) {
		return null
	}

	return keypair.secretKey
}

export async function setNearPrivateKey(privateKey: Uint8Array, accountId: string) {
	const encodedPrivateKey = baseEncode(privateKey)
	const keypair = new KeyPairEd25519(encodedPrivateKey)

	const keystore = new keyStores.BrowserLocalStorageKeyStore()
	await keystore.setKey(nearConfig.networkId, accountId, keypair)
	return true
}

export function generateAndSetKey() {
	const keyRandom = KeyPairEd25519.fromRandom()
	const accountId = uint8ArrayToHexString(keyRandom.publicKey.data)

	const sk = new Uint8Array(baseDecode(keyRandom.secretKey))
	const encodedPrivateKey = baseEncode(sk)
	const keypair = new KeyPairEd25519(encodedPrivateKey)
	setNearPrivateKey(sk, accountId)
	return { accountId, privateKey: keypair.secretKey }
}

export async function removeNearPrivateKey(nearAccountId?: string | null) {
	let accountId: string | null = null

	if (nearAccountId) {
		accountId = nearAccountId
	} else if (_contract) {
		accountId = _contract.account.accountId
	} else {
		throw new Error(`Contract not yet initialised!`)
	}

	const keystore = new keyStores.BrowserLocalStorageKeyStore()
	await keystore.removeKey(nearConfig.networkId, accountId)
}

export async function getUserInfoNEAR(
	username: string,
): Promise<{ accountId: string; publicKey: Uint8Array; blocked?: true }> {
	const contract = getContract() as any
	const userInfo = (await contract.getUserInfo({ username })) as null | Array<string>
	if (!userInfo) {
		throw new Error(`Username not found on NEAR!`)
	}
	// Base58 decode the public key, return it as a Uint8Array
	const publicKey = new Uint8Array(baseDecode(userInfo[1]))
	if (publicKey[0] !== 0 || publicKey.length !== 33) {
		throw new Error(`First element is non-null`)
	}

	const blockOnNear = userInfo[2]
	if (blockOnNear) {
		return { accountId: userInfo[0], publicKey: publicKey.slice(1), blocked: true }
	}

	return { accountId: userInfo[0], publicKey: publicKey.slice(1) }
}

// (But why does eslint complain here? It doesn't make sense to me - seems like a bug?)
// eslint-disable-next-line no-shadow
enum SetUserInfoStatus {
	Success = 1,
	UsernameTooSmall,
	UsernameAlreadyExists,
	UsernameTooLarge,
	NearAccountAlreadyLinked,
	AccountNotOnboarded,
	UsernameBlockListed,
	InvalidCharsUsername,
}

export async function setUserInfoNEAR(username: string) {
	const contract = getContract() as any
	const status = (await contract.setUserInfo({ args: { username } })) as SetUserInfoStatus
	switch (status) {
		case SetUserInfoStatus.Success:
			return { success: true }
		case SetUserInfoStatus.UsernameTooSmall:
			return { success: false, error: `Username should contain at least 3 characters!` }
		case SetUserInfoStatus.UsernameAlreadyExists:
			return { success: false, error: `Username already exists!` }
		case SetUserInfoStatus.UsernameTooLarge:
			return { success: false, error: `Username should not contain more than 18 characters!` }
		case SetUserInfoStatus.NearAccountAlreadyLinked:
			return { success: false, error: `Your NEAR Account is already linked to another username` }
		case SetUserInfoStatus.AccountNotOnboarded:
			return { success: false, error: `Account does not have a valid invite code` }
		case SetUserInfoStatus.UsernameBlockListed:
			return { success: false, error: `Username should not contain blocklisted keywords` }
		case SetUserInfoStatus.InvalidCharsUsername:
			return { success: false, error: `Username can only contain lowercase alphanumeric characters or underscores` }
		default:
			throw new Error(`Unknown status encountered while updating info on NEAR`)
	}
}

export async function validateUsernameNEAR(username: string) {
	const contract = getContract() as any
	const status = (await contract.validateUsername({ username })) as 1 | 2 | 3 | 4 | 7 | 8
	switch (status) {
		case 1:
			return { success: true }
		case 2:
			return { success: false, error: `Username should contain at least 3 characters` }
		case 3:
			return { success: false, error: `Username already exists!` }
		case 4:
			return { success: false, error: `Username should not contain more than 18 characters!` }
		case 7:
			return { success: false, error: `Username should not contain blocklisted keywords` }
		case 8:
			return { success: false, error: `Username can only contain lowercase letters, numbers, or underscores` }
		default:
			throw new Error(`Unknown status encountered while validating username on NEAR`)
	}
}
