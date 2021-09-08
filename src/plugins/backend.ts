import { Plugin } from '@nuxt/types'
import { initIPFS } from '@/backend/utilities/ipfs'
import { getWalletConnection, initContract, walletLogin } from '@/backend/near'

const backend: Plugin = async (_context, inject) => {
	await initIPFS()

	// Initialise contract API
	await initContract()
	// eslint-disable-next-line no-console
	console.log(`Smart Contract API initialised!`)

	const walletConnection = getWalletConnection()
	// eslint-disable-next-line no-console
	console.log(`Is Signed in? ${walletConnection.isSignedIn()}`)

	inject(`walletLogin`, walletLogin)
}

export default backend
