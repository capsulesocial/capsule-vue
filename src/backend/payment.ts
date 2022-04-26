import axios from 'axios'
import { capsuleServer } from './utilities/config'
import { uint8ArrayToHexString } from './utilities/helpers'
import { signContent } from './utilities/keys'
import { SubscriptionTier } from '@/store/paymentProfile'

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

export async function generatePaymentIntent(
	username: string,
	tierId: string,
	amount: number,
	period: string,
	email: string,
) {
	try {
		const data = {
			username,
			action: `startSubscription`,
			tierId,
			amount,
			period,
			email,
			exp: getExpTimestamp(),
		}
		const { sig } = await signContent(data)
		const response = await axios.post(`${capsuleServer}/pay/stripe/subscribe/start`, {
			data,
			sig: uint8ArrayToHexString(sig),
		})
		return response.data
	} catch (err) {
		return null
	}
}

export async function fetchPaymentProfile(username: string) {
	try {
		const response = await axios.get(`${capsuleServer}/pay/profile/${username}`)
		return response.data
	} catch (err) {
		return null
	}
}

export function getCurrencySymbol(currency: string) {
	switch (currency) {
		case `gbp`:
			return `£`
		case `eur`:
			return `€`
		case `inr`:
			return `₹`
		case `yen`:
			return `¥`
		case `cad`:
			return `C$`
		case `sgd`:
			return `C$`
		case `aud`:
			return `S$`
		case `usd`:
		default:
			return `$`
	}
}

export function getAmountFromTier(period: string, tier: SubscriptionTier) {
	if (period === `month`) {
		return tier.monthlyPrice
	} else if (period === `year`) {
		return tier.yearlyPrice
	}
	return 0
}

export function getZeroDecimalAmount(currency: string, amount: number) {
	const zeroDecimalCurrencies = [
		`bif`,
		`clp`,
		`djf`,
		`gnf`,
		`jpy`,
		`kmf`,
		`krw`,
		`mga`,
		`pyg`,
		`rwf`,
		`ugx`,
		`vnd`,
		`vuv`,
		`xaf`,
		`xof`,
		`xpf`,
	]

	if (zeroDecimalCurrencies.includes(currency)) {
		return amount
	}

	return amount * 100
}

export async function fetchSubscriptionStatus(username: string, paymentIntent: string) {
	try {
		const data = {
			username,
			action: `checkSubscriptionStatus`,
			paymentIntentId: paymentIntent,
			exp: getExpTimestamp(),
		}
		const { sig } = await signContent(data)
		const response = await axios.post(`${capsuleServer}/pay/stripe/subscribe/status`, {
			data,
			sig: uint8ArrayToHexString(sig),
		})
		return response.data
	} catch (err) {
		return null
	}
}
