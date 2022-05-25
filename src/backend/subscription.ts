import { genericRequest } from './utilities/request'

export interface ISubscriptionResponse {
	authorID: string
	tier: { id: string; name: string }
	isActive: boolean
	renewalDate?: number | undefined
	subscriptionId: string
	startedOn: number
}

export interface SubsTransaction {
	transactionId: string
	receiptUrl: string
	currency: string
	amount: number
	createdAt: Date
	status: string
}

export async function getUserSubscriptions(self: string) {
	const res = await genericRequest<{ data: Array<ISubscriptionResponse> }>({
		method: `get`,
		path: `/subscription`,
		username: self,
	})

	// to add:
	// 1. number of months in a row
	// 2. total number of months subscribed
	return res.data
}

export async function cancelSubscription(username: string, subscriptionId: string) {
	await genericRequest({
		method: `post`,
		path: `/subscription/unsubscribe`,
		username,
		body: { subscriptionId },
	})
}

export async function getSubscriptionTransactions(username: string, subscriptionId: string) {
	const res = await genericRequest<{ data: Array<SubsTransaction> }>({
		method: `get`,
		path: `/subscription/transactions/${subscriptionId}`,
		username,
	})

	return res.data
}
