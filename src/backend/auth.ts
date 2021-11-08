import { getED25519Key } from '@toruslabs/openlogin-ed25519'
import { base_encode as baseEncode } from 'near-api-js/lib/utils/serialize'
import { PublicKey } from 'near-api-js/lib/utils'

import { initContract, setUserInfoNEAR, setNearPrivateKey } from './near'
import { addProfileToIPFS, createDefaultProfile, getProfile, Profile } from './profile'
import { uint8ArrayToHexString } from './utilities/helpers'

export function getAccountId(privateKey: string) {
	const { pk } = getED25519Key(privateKey)

	const pk58 = `ed25519:${baseEncode(pk)}`
	const accountId = uint8ArrayToHexString(PublicKey.fromString(pk58).data)

	return accountId
}

// POST newly created account to IPFS
export async function register(id: string, privateKey: string): Promise<{ cid: string; profile: Profile }> {
	const { sk } = getED25519Key(privateKey)

	const accountId = getAccountId(privateKey)
	// Reinitialise Smart Contract API
	setNearPrivateKey(sk, accountId)
	await initContract(accountId)
	const profile = createDefaultProfile(id)

	const [cid, userSetStatus] = await Promise.all([addProfileToIPFS(profile), setUserInfoNEAR(id)])

	if (!userSetStatus.success) {
		throw new Error(userSetStatus.error)
	}

	return { cid, profile }
}

export async function login(
	id: string,
	privateKey: string,
): Promise<{ success: boolean; profile: Profile; profileCID: string }> {
	const accountId = getAccountId(privateKey)

	const { sk } = getED25519Key(privateKey)
	setNearPrivateKey(sk, accountId)

	const value = {
		accountId,
		allKeys: [],
	}
	window.localStorage.setItem(`null_wallet_auth_key`, JSON.stringify(value))

	// Reinitialise Smart Contract API
	await initContract(accountId)

	let profile = createDefaultProfile(id)
	const fetchedProfile = await getProfile(id)
	if (fetchedProfile) {
		profile = fetchedProfile
	}

	const profileCID = await addProfileToIPFS(profile)
	return { success: true, profile, profileCID }
}
