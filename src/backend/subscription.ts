import { genericRequest } from './utilities/request'

export interface ISubscriptionResponse {
	authorID: string
	tier: { id: string; name: string }
	isActive: boolean
	renewalDate?: number | undefined
	subscriptionId: string
}

export interface SubsTransactions {
	transactionId: string
	receiptUrl: string
	paidAmount: string
	date: number
	status: string
}

export async function getUserSubscriptions(self: string, includeExpired?: boolean) {
	const res = await genericRequest({
		method: `get`,
		path: `/subscription`,
		username: self,
		...(includeExpired ? { params: { expired: true } } : {}),
	})

	// to add:
	// 1. number of months in a row
	// 2. total number of months subscribed
	return res.data as ISubscriptionResponse[]
}

export async function cancelSubscription(username: string, subscriptionId: string) {
	await genericRequest({
		method: `post`,
		path: `/subscription/unsubscribe`,
		username,
		body: { subscriptionId },
	})
}

export async function getSubscriptionTransactions(self: string, subscriptionId: string) {
	const res = await genericRequest({
		method: `get`,
		path: `/subscription/transactions/${subscriptionId}`,
		username: self,
	})

	return res.data as SubsTransactions[]
}
