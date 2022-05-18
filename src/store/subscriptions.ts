import type { MutationTree } from 'vuex'
import { ActionContext } from 'vuex'
import { RootState } from '.'
import type { ISubscriptionResponse } from '@/backend/subscription'
import { getUserSubscriptions } from '@/backend/subscription'
import { ValidationError } from '@/errors'

export const namespace = `subscriptions`

export interface ISubscriptionStore {
	active: ISubscriptionResponse[]
	inactive: ISubscriptionResponse[]
}

export const state = (): ISubscriptionStore => ({
	active: [],
	inactive: [],
})

export const MutationType = {
	ADD_ACTIVE: `addActive`,
	ADD_INACTIVE: `addInactive`,
	RESET: `reset`,
}

export const ActionType = {
	FETCH_SUBS: `fetchSubs`,
}

export const mutations: MutationTree<ISubscriptionStore> = {
	[MutationType.ADD_ACTIVE]: (state, sub: ISubscriptionResponse) => {
		state.active.push(sub)
	},
	[MutationType.ADD_INACTIVE]: (state, sub: ISubscriptionResponse) => {
		state.inactive.push(sub)
	},
	[MutationType.RESET]: (state) => {
		state.inactive = []
		state.active = []
	},
}

export const actions = {
	async [ActionType.FETCH_SUBS](context: ActionContext<ISubscriptionStore, RootState>, id: string) {
		context.commit(MutationType.RESET)
		try {
			const subs = await getUserSubscriptions(id)
			subs.forEach((s) => {
				if (s.isActive) {
					context.commit(MutationType.ADD_ACTIVE, s)
					return
				}
				context.commit(MutationType.ADD_INACTIVE, s)
			})
		} catch (err) {
			throw new ValidationError(`Error when fetching subscriptions`)
		}
	},
}

export const getters = {
	activeSubs(state: ISubscriptionStore): ISubscriptionResponse[] {
		return state.active
	},
	inactiveSubs(state: ISubscriptionStore): ISubscriptionResponse[] {
		return state.inactive
	},
}
