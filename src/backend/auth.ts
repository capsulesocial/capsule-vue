import { getED25519Key } from '@toruslabs/openlogin-ed25519'
import { base_decode as baseDecode, base_encode as baseEncode } from 'near-api-js/lib/utils/serialize'
import { PublicKey } from 'near-api-js/lib/utils'

import { initContract, setUserInfoNEAR, setNearPrivateKey } from './near'
import { addProfileToIPFS, createDefaultProfile, getProfile, Profile } from './profile'
import { uint8ArrayToHexString } from './utilities/helpers'

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

async function authUser(privateKey: string) {
	const accountId = getAccountIdFromPrivateKey(privateKey)
	const { sk } = getED25519Key(privateKey)

	setNearPrivateKey(sk, accountId)
	// Reinitialise Smart Contract API
	await initContract(accountId)
	window.localStorage.setItem(`accountId`, accountId)
}

// POST newly created account to IPFS
export async function register(id: string, privateKey: string): Promise<IAuthResult> {
	await authUser(privateKey)

	const profile = createDefaultProfile(id)
	const [cid, userSetStatus] = await Promise.all([addProfileToIPFS(profile), setUserInfoNEAR(id)])

	if (!userSetStatus.success) {
		throw new Error(userSetStatus.error)
	}

	return { profile, cid }
}

export async function registerNearWallet(id: string, accountId: string): Promise<IAuthResult> {
	initContract(accountId)
	window.localStorage.setItem(`accountId`, accountId)

	const profile = createDefaultProfile(id)
	const [cid, userSetStatus] = await Promise.all([addProfileToIPFS(profile), setUserInfoNEAR(id)])

	if (!userSetStatus.success) {
		throw new Error(userSetStatus.error)
	}

	return { profile, cid }
}

export async function login(id: string, privateKey: string): Promise<IAuthResult> {
	await authUser(privateKey)

	let profile = createDefaultProfile(id)
	const fetchedProfile = await getProfile(id)
	if (fetchedProfile) {
		profile = fetchedProfile
	}
	const cid = await addProfileToIPFS(profile)

	return { profile, cid }
}

export async function loginNearAccount(id: string, privateKey: string, accountId: string): Promise<IAuthResult> {
	let profile = createDefaultProfile(id)

	const [fetchedProfile] = await Promise.all([getProfile(id), setNearPrivateKey(baseDecode(privateKey), accountId)])

	initContract(accountId)
	window.localStorage.setItem(`accountId`, accountId)

	if (fetchedProfile) {
		profile = fetchedProfile
	}
	const cid = await addProfileToIPFS(profile)

	return { profile, cid }
}
