import { Authentication } from '~/interfaces/Authentication'

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$sendAuthentication: (data: Authentication) => Promise<boolean>
	}
}

const axios = require(`axios`).default
const serverURL = `http://0.0.0.0:8080`

async function sendAuthentication(data: Authentication): Promise<boolean> {
	// Encoding all values to hex
	const nonce = Buffer.from(data.privateKey.nonce).toString(`hex`)
	const encPrivateKey = Buffer.from(data.privateKey.encryptedPeerIDPrivateKey).toString(`hex`)
	const hp1 = Buffer.from(data.privateKey.hp1).toString(`hex`)

	const requestURL = new URL(`/write/${data.id}/${encPrivateKey}/${nonce}/${hp1}`, serverURL)
	try {
		const response = await axios.get(requestURL.toString())
		if (response.data.status === `OK`) {
			// Registration successful!
			return true
		} else {
			// Registration failed!
		}
	} catch {
		// Unable to send a request!
	}
	return false
}

export { sendAuthentication }
