import axios from 'axios'
import { capsuleServer } from './utilities/config'
import { getExpTimestamp, uint8ArrayToHexString } from './utilities/helpers'
import libsodium from './utilities/keys'

interface ITokenData {
	token: string
	exp: number
}

async function getAuthToken(username: string): Promise<ITokenData> {
	const data = { username, action: `authentication`, exp: getExpTimestamp() }
	const { sig } = await libsodium().signContent(data)
	const response = await axios.post(`${capsuleServer}/auth`, {
		data,
		sig: uint8ArrayToHexString(sig),
	})
	return response.data
}

export async function getToken(username: string, reset = false): Promise<string> {
	try {
		if (reset) {
			throw new Error(`Token to be resetted`)
		}

		const tokenData = localStorage.getItem(`serverAuthToken`)
		if (!tokenData) {
			throw new Error(`No token`)
		}

		const { token, exp }: ITokenData = JSON.parse(tokenData)
		if (Date.now() > exp - 60000) {
			throw new Error(`Token is expired`)
		}

		return token
	} catch (err) {
		const { token, exp } = await getAuthToken(username)
		localStorage.setItem(`serverAuthToken`, JSON.stringify({ token, exp }))
		return token
	}
}
