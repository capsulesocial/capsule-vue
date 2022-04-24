import axios from 'axios'
import { capsuleServer } from './utilities/config'
import { uint8ArrayToHexString } from './utilities/helpers'
import { signContent } from './utilities/keys'

function getExpTimestamp() {
	return Date.now() + 5 * 60 * 1000
}

export async function generateStripeOnboard(username: string) {
	const data = { username, action: `onboardStripe`, exp: getExpTimestamp() }
	const { sig } = await signContent(data)
	const response = await axios.post(`${capsuleServer}/pay/stripe/connect/onboard`, {
		data,
		sig: uint8ArrayToHexString(sig),
	})
	return response.data.url
}

export async function refreshStripeAccount(username: string) {
	const data = { username, action: `refreshStripe`, shouldUpdate: true, exp: getExpTimestamp() }
	const { sig } = await signContent(data)
	const response = await axios.post(`${capsuleServer}/pay/stripe/connect/refresh`, {
		data,
		sig: uint8ArrayToHexString(sig),
	})
	return response.data.url
}

export async function generatePaymentIntent(username: string, tierId: string, amount: number, period: string) {
	const data = {
		username,
		action: `startSubscription`,
		tierId,
		amount,
		period,
		exp: getExpTimestamp(),
	}
	const { sig } = await signContent(data)
	const response = await axios.post(`${capsuleServer}/pay/stripe/subscribe/start`, {
		data,
		sig: uint8ArrayToHexString(sig),
	})
	return response.data
}

export async function fetchPaymentProfile(username: string) {
	const response = await axios.get(`${capsuleServer}/pay/profile/${username}`)
	return response.data
}
