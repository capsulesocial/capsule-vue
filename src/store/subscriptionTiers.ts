import { ActionContext } from 'vuex'
import type { GetterTree, MutationTree } from 'vuex'
import { RootState } from '.'
import { retrievePaymentProfile } from '@/backend/payment'

export const namespace = `subscriptionTiers`

export interface Tier {
	_id?: string
	name: string
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
