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
	window.localStorage.setItem(`accountId`, accountId)

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
	window.localStorage.setItem(`accountId`, accountId)

	const profile = fetchedProfile.profile || createDefaultProfile(id)
	const cid = await addProfileToIPFS(profile)

	return { profile, cid }
}
