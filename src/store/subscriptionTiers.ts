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

export interface Tiers {
	tierList: Tier[]
}

export const state = (): Tiers => ({
	tierList: [],
})

export const ActionType = {
	GET_TIERS: `getTiers`,
}

export const MutationType = {
	SET_TIERS: `setTiers`,
	LOGOUT: `logout`,
}

export const getters: GetterTree<Tiers, RootState> = {
	tiers: (state: Tiers): Tier[] => {
		return state.tierList
	},
}

export const mutations: MutationTree<Tiers> = {
	[MutationType.SET_TIERS]: (state, t: Tier[]) => {
		state.tierList = t
	},
	[MutationType.LOGOUT]: (state) => {
		state.tierList = []
	},
}

// Fetch my tiers
export const actions = {
	async [ActionType.GET_TIERS](context: ActionContext<Tiers, RootState>, id: string) {
		const profile = await retrievePaymentProfile(id)
		context.commit(MutationType.SET_TIERS, profile)
	},
}
