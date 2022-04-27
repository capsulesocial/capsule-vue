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
}

export const ActionType = {
	FETCH_PROFILE: `fetchProfile`,
}

export const mutations: MutationTree<PaymentProfileMap> = {
	[MutationType.ADD_PROFILE]: (state, paymentProfile) => {
		Vue.set(state.profiles, paymentProfile.username, paymentProfile)
	},
}

export const actions = {
	async [ActionType.FETCH_PROFILE](
		context: ActionContext<PaymentProfileMap, RootState>,
		payload: { username: string },
	) {
		const { username } = payload
		const profile = await retrievePaymentProfile(username)
		context.commit(MutationType.ADD_PROFILE, profile)
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
