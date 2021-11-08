import { getED25519Key } from '@toruslabs/openlogin-ed25519'
import { base_encode as baseEncode } from 'near-api-js/lib/utils/serialize'
import { PublicKey } from 'near-api-js/lib/utils'

import { initContract, setUserInfoNEAR, setNearPrivateKey } from './near'
import { addProfileToIPFS, createDefaultProfile, getProfile, Profile } from './profile'
import { uint8ArrayToHexString } from './utilities/helpers'

export interface IAuthResult {
	profile: Profile
	cid: string
}

export function getAccountId(privateKey: string) {
	const { pk } = getED25519Key(privateKey)

	const pk58 = `ed25519:${baseEncode(pk)}`
	const accountId = uint8ArrayToHexString(PublicKey.fromString(pk58).data)

	return accountId
}

// POST newly created account to IPFS
export async function register(id: string, privateKey: string): Promise<IAuthResult> {
	const { sk } = getED25519Key(privateKey)
	const accountId = getAccountId(privateKey)

	setNearPrivateKey(sk, accountId)

	// Reinitialise Smart Contract API
	await initContract(accountId)

	const profile = createDefaultProfile(id)
	const [cid, userSetStatus] = await Promise.all([addProfileToIPFS(profile), setUserInfoNEAR(id)])

	if (!userSetStatus.success) {
		throw new Error(userSetStatus.error)
	}

	window.localStorage.setItem(`accountId`, accountId)
	return { profile, cid }
}

export async function login(id: string, privateKey: string): Promise<IAuthResult> {
	const accountId = getAccountId(privateKey)
	const { sk } = getED25519Key(privateKey)

	setNearPrivateKey(sk, accountId)
	const contractPromise = initContract(accountId)

	let profile = createDefaultProfile(id)

	const fetchedProfile = await getProfile(id)
	if (fetchedProfile) {
		profile = fetchedProfile
	}
	const [cid] = await Promise.all([addProfileToIPFS(profile), contractPromise])

	window.localStorage.setItem(`accountId`, accountId)
	return { profile, cid }
}
