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
import type { GetterTree, MutationTree } from 'vuex'
import { ActionContext } from 'vuex'
import Vue from 'vue'
import { RootState } from '.'
import { retrievePaymentProfile } from '@/backend/payment'

export const namespace = `paymentProfile`

export interface SubscriptionTier {
	_id: string
	username: string
	name: string
	monthlyEnabled: boolean
	monthlyPrice: number
	yearlyEnabled: boolean
	yearlyPrice: number
}

export interface PaymentProfile {
	username: string
	paymentsEnabled: boolean
	currency: string
	stripeAccountId: string
	tiers: SubscriptionTier[]
}

export interface PaymentProfileMap {
	profiles: {
		[key: string]: PaymentProfile
	}
}

export const state = (): PaymentProfileMap => ({
	profiles: {},
})

export const MutationType = {
	ADD_PROFILE: `addProfile`,
	RESET: `reset`,
}

export const ActionType = {
	FETCH_PROFILE: `fetchProfile`,
}

export const mutations: MutationTree<PaymentProfileMap> = {
	[MutationType.ADD_PROFILE]: (state, paymentProfile) => {
		Vue.set(state.profiles, paymentProfile.username, paymentProfile)
	},
	[MutationType.RESET]: (state) => {
		state.profiles = {}
	},
}

export const actions = {
	async [ActionType.FETCH_PROFILE](
		context: ActionContext<PaymentProfileMap, RootState>,
		payload: { username: string },
	) {
		const { username } = payload
		try {
			const profile = await retrievePaymentProfile(username)
			context.commit(MutationType.ADD_PROFILE, profile)
		} catch (ex) {
			context.commit(MutationType.ADD_PROFILE, createDefaultPaymentProfile(username))
			throw ex
		}
	},
}

export const getters: GetterTree<PaymentProfileMap, RootState> = {
	getPaymentProfile: (state: PaymentProfileMap) => (username: string) => {
		if (state.profiles[username]) {
			return state.profiles[username]
		}

		return createDefaultPaymentProfile(username)
	},
}

export function createDefaultPaymentProfile(username: string): PaymentProfile {
	return {
		username,
		paymentsEnabled: false,
		currency: ``,
		stripeAccountId: ``,
		tiers: [],
	}
}
