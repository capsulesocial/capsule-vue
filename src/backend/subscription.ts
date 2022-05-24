import { genericRequest } from './utilities/request'

export interface ISubscriptionResponse {
	authorID: string
	tier: { id: string; name: string }
	isActive: boolean
	renewalDate?: number | undefined
	subscriptionId: string
	startedOn: number
}

export interface SubsTransactions {
	transactionId: string
	receiptUrl: string
	paidAmount: string
	date: number
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

export async function getSubscriptionTransactions(self: string, subscriptionId: string) {
	const res = await genericRequest<{ data: Array<SubsTransactions> }>({
		method: `get`,
		path: `/subscription/transactions/${subscriptionId}`,
		username: self,
	})

	return res.data
}
