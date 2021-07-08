import { Profile } from "../interfaces/Profile"
import { getEncryptedPeerIDPrivateKey } from "./crypto"

// POST newly created account to IPFS
async function register (payload: Profile, peerIDPrivateKey: string, peerIDPublicKey: string) {
	const privateKey = await getEncryptedPeerIDPrivateKey(payload, peerIDPrivateKey, peerIDPublicKey)

	return privateKey
}
