import { getED25519Key } from '@toruslabs/openlogin-ed25519'
import { base_decode as baseDecode, base_encode as baseEncode } from 'near-api-js/lib/utils/serialize'
import { PublicKey } from 'near-api-js/lib/utils'

import {
	initContract,
	setUserInfoNEAR,
	setNearPrivateKey,
	signedInToWallet,
	getWalletConnection,
	getNearPrivateKey,
} from './near'
import { addProfileToIPFS, createDefaultProfile, getProfile, Profile } from './profile'
import { uint8ArrayToHexString } from './utilities/helpers'

export interface IWalletStatus {
	type: `torus` | `near`
	accountId: string
	privateKey: string
}

export interface IAuthResult {
	profile: Profile
	cid: string
}

export function getAccountIdFromPrivateKey(privateKey: string) {
	const { pk } = getED25519Key(privateKey)

	const pk58 = `ed25519:${baseEncode(pk)}`
	const accountId = uint8ArrayToHexString(PublicKey.fromString(pk58).data)

	return accountId
}

// This is only needed with Torus and implicit login
export async function setNearUserFromPrivateKey(privateKey: string) {
	const accountId = getAccountIdFromPrivateKey(privateKey)
	const { sk } = getED25519Key(privateKey)

	await setNearPrivateKey(sk, accountId)

	return accountId
}

// POST newly created account to IPFS
export async function register(id: string, accountId: string): Promise<IAuthResult | { error: string }> {
	// Reinitialise Smart Contract API
	initContract(accountId)

	const profile = createDefaultProfile(id)
	const [cid, userSetStatus] = await Promise.all([addProfileToIPFS(profile), setUserInfoNEAR(id)])

	if (userSetStatus.error) {
		return { error: userSetStatus.error }
	}

	return { profile, cid }
}

export async function login(id: string, privateKey: string): Promise<IAuthResult> {
	await setNearUserFromPrivateKey(privateKey)

	let profile = createDefaultProfile(id)
	const fetchedProfile = await getProfile(id)
	if (fetchedProfile.profile) {
		profile = fetchedProfile.profile
	}
	const cid = await addProfileToIPFS(profile)

	return { profile, cid }
}

export async function loginNearAccount(id: string, privateKey: string, accountId: string): Promise<IAuthResult> {
	const [fetchedProfile] = await Promise.all([getProfile(id), setNearPrivateKey(baseDecode(privateKey), accountId)])

	initContract(accountId)

	const profile = fetchedProfile.profile || createDefaultProfile(id)
	const cid = await addProfileToIPFS(profile)

	return { profile, cid }
}

export async function getUserInfo(): Promise<IWalletStatus | null> {
	// In the case of near wallet sign up
	const nearWallet = signedInToWallet()
	if (nearWallet) {
		const walletConnection = getWalletConnection()
		const accountId: string = walletConnection.getAccountId()
		if (!accountId) {
			throw new Error(`Wallet without accountId!`)
		}
		const privateKey = await getNearPrivateKey(accountId)
		if (!privateKey) {
			throw new Error(`Wallet without private key!`)
		}
		return {
			type: `near`,
			accountId,
			privateKey,
		}
	}

	// If the user has refreshed or backtracked etc
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i)
		if (key && key.startsWith(`near-api-js:keystore`)) {
			const privateKey = localStorage.getItem(key)
			const accountId = key.split(`:`)[2]
			if (privateKey && accountId) {
				return {
					type: `near`,
					accountId,
					privateKey,
				}
			}
		}
	}

	return null
}
