/*
 * Copyright (c) 2021-2022 Capsule Social, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */
import { genericRequest } from './utilities/request'

export interface ISubscriptionResponse {
	subscriptionId: string
	authorID: string
	username: string
	amount: number
	period: string
	currency: string
	tier: { name: string; id: string }
	createdAt: number
	isActive: boolean
	expiredAt: number | null
	renewalInfo?: {
		message?: string
		lastInvoiceId?: string
		invoiceCreationDate: number
		invoiceUpdationDate: number
		dueDate: number | null
		status: string
	}
}

export interface SubsTransaction {
	transactionId: string
	receiptUrl: string
	currency: string
	amount: number
	createdAt: number
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
