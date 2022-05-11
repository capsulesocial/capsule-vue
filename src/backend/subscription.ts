import axios from 'axios'
import { capsuleServer, sigValidity } from './utilities/config'
import { uint8ArrayToHexString } from './utilities/helpers'
import { signContent } from './utilities/keys'

export interface ISubscriptionResponse {
	authorID: string
	tier: string
	isActive: boolean
	renewDate?: number | undefined
	subscriptionId: string
}

export interface ISubCardData {
	name: string
	id: string
	subscriptionId: string
	tier: string
	monthlySubs: number
	renewDate?: number | undefined
	avatar?: string
}

export async function getUserSubscriptions(self: string, includeExpired?: boolean) {
	const data = {
		username: self,
		action: `getUserSubs`,
		exp: Date.now() + sigValidity,
		...(includeExpired ? { expired: true } : {}),
	}

	const { sig } = await signContent(data)
	const res = await axios.post(`${capsuleServer}/subscription`, {
		data,
		sig: uint8ArrayToHexString(sig),
	})

	return res.data.data as {
		// to add:
		// 1. number of months in a row
		// 2. total number of months subscribed
		authorID: string
		// tier contains tierId right now,
		// will contain tier name instead
		tier: { id: string; name: string }
		isActive: boolean
		subscriptionId: string
		renewalDate?: number
	}[]
}

export async function cancelSubscription(username: string, authorID: string) {
	const data = {
		username,
		authorID,
		exp: Date.now() + sigValidity,
		action: `cancelSubscription`,
	}

	const { sig } = await signContent(data)

	await axios.post(`${capsuleServer}/subscription/unsubscribe`, {
		data,
		sig: uint8ArrayToHexString(sig),
	})
}

export async function getSubscriptionTransactions(self: string, subscriptionId: string) {
	const data = {
		username: self,
		subscriptionId,
		action: `getSubTransactions`,
		exp: Date.now() + sigValidity,
	}

	const { sig } = await signContent(data)

	const res = await axios.post(`${capsuleServer}/subscription/transactions`, {
		data,
		sig: uint8ArrayToHexString(sig),
	})

	return res.data.data as {
		transactionId: string
		receiptUrl: string
		paidAmount: string
		date: number
		status: string
	}[]
}
