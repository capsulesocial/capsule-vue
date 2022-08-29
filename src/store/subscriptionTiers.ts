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
import { ActionContext } from 'vuex'
import type { GetterTree, MutationTree } from 'vuex'
import { RootState } from '.'
import { retrievePaymentProfile } from '@/backend/payment'

export const namespace = `subscriptionTiers`

export interface Tier {
	_id?: string
	name: string
	description?: string
	details?: string
	monthlyEnabled: boolean
	monthlyPrice: number
	yearlyEnabled: boolean
	yearlyPrice: number
}

export interface IStore {
	tierList: Tier[]
	subscriptionsEnabled: boolean
}

export const state = (): IStore => ({
	tierList: [],
	subscriptionsEnabled: false,
})

export const ActionType = {
	GET_TIERS: `getTiers`,
}

export const MutationType = {
	SET_TIERS: `setTiers`,
	SET_SUBSCRIPTIONS_ENABLED: `setSubscriptionsEnabled`,
	LOGOUT: `logout`,
}

export const getters: GetterTree<IStore, RootState> = {
	tiers: (state: IStore): Tier[] => {
		return state.tierList
	},
	enabledSubscriptions: (state: IStore): boolean => {
		return state.subscriptionsEnabled
	},
}

export const mutations: MutationTree<IStore> = {
	[MutationType.SET_TIERS]: (state, t: Tier[]) => {
		state.tierList = t
	},
	[MutationType.SET_SUBSCRIPTIONS_ENABLED]: (state, enabled: boolean = false) => {
		state.subscriptionsEnabled = enabled
	},
	[MutationType.LOGOUT]: (state) => {
		state.tierList = []
		state.subscriptionsEnabled = false
	},
}

// Fetch my tiers
export const actions = {
	async [ActionType.GET_TIERS](context: ActionContext<IStore, RootState>, id: string) {
		const profile = await retrievePaymentProfile(id)
		context.commit(MutationType.SET_TIERS, profile.tiers)
		context.commit(MutationType.SET_SUBSCRIPTIONS_ENABLED, profile.paymentsEnabled)
	},
}
