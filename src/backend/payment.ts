import axios, { AxiosError } from 'axios'
import { capsuleServer } from './utilities/config'
import { genericRequest } from './utilities/request'
import { SubscriptionTier } from '@/store/paymentProfile'

export async function startSubscriptionPayment(
	username: string,
	tier: SubscriptionTier,
	period: string,
	paymentMethodId: string,
	email: string,
) {
	const amount = getAmountFromTier(period, tier)
	try {
		const data = {
			tierId: tier._id,
			amount,
			period,
			email,
			paymentMethodId,
		}
		const response = await genericRequest({
			method: `post`,
			path: `/pay/stripe/subscribe/start`,
			username,
			body: { data },
		})
		return response
	} catch (err) {
		if (err instanceof AxiosError && err.response) {
			throw new Error(err.response.data?.error ?? err.message)
		}
		throw new Error(`Network error: ${err}`)
	}
}

export async function confirmSubscriptionPayment(username: string, paymentAttemptId: string, paymentIntentId: string) {
	try {
		const data = {
			username,
			paymentAttemptId,
			paymentIntentId,
		}
		const response = await genericRequest({
			method: `post`,
			path: `/pay/stripe/subscribe/confirm`,
			username,
			body: { data },
		})
		return response
	} catch (err) {
		if (err instanceof AxiosError && err.response) {
			throw new Error(err.response.data?.error ?? err.message)
		}
		throw new Error(`Network error: ${err}`)
	}
}

export async function retrievePaymentProfile(username: string) {
	const response = await axios.get(`${capsuleServer}/pay/profile/${username}`)
	return response.data
}

export function getCurrencySymbol(currency: string) {
	switch (currency) {
		case `usd`:
			return `$`
		case `aed`:
			return `د.إ`
		case `aud`:
			return `A$`
		case `bgn`:
			return `лв`
		case `brl`:
			return `R$`
		case `cad`:
			return `C$`
		case `chf`:
			return `Fr`
		case `czk`:
			return `Kč`
		case `dkk`:
			return `kr`
		case `eur`:
			return `€`
		case `gbp`:
			return `£`
		case `hkd`:
			return `HK$`
		case `huf`:
			return `Ft`
		case `inr`:
			return `₹`
		case `jpy`:
			return `¥`
		case `mxn`:
			return `M$`
		case `myr`:
			return `RM`
		case `nok`:
			return `kr`
		case `NZD`:
			return `N$`
		case `pln`:
			return `zł`
		case `ron`:
			return `lei`
		case `sek`:
			return `kr`
		case `sgd`:
			return `S$`
		default:
			return currency
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
