import type { MutationTree } from 'vuex'
import { ActionContext } from 'vuex'
import { RootState } from '.'
import type { ISubscriptionResponse } from '@/backend/subscription'
import { getUserSubscriptions } from '@/backend/subscription'
import { ValidationError } from '@/errors'
import { createDefaultProfile, getProfile } from '@/backend/profile'

export const namespace = `subscriptions`

export interface ISubscriptionWithProfile extends ISubscriptionResponse {
	authorID: string
	name: string
	avatar: string
	monthsSubbed: number
}

export interface ISubscriptionStore {
	active: ISubscriptionWithProfile[]
	inactive: ISubscriptionWithProfile[]
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
	[MutationType.ADD_ACTIVE]: (state, sub: ISubscriptionWithProfile) => {
		state.active.push(sub)
	},
	[MutationType.ADD_INACTIVE]: (state, sub: ISubscriptionWithProfile) => {
		state.inactive.push(sub)
	},
	[MutationType.RESET]: (state) => {
		state.inactive = []
		state.active = []
	},
}

export const actions = {
	async [ActionType.FETCH_SUBS](context: ActionContext<ISubscriptionStore, RootState>, id: string) {
		try {
			const subs = await getUserSubscriptions(id)
			const subsWithProfiles = []
			for (const sub of subs) {
				const fetchedProfile = await getProfile(sub.authorID)
				const profile = fetchedProfile?.profile ?? createDefaultProfile(sub.authorID)
				const subWithProfile = {
					...sub,
					name: profile.name,
					avatar: profile.avatar,
					// TODO remove this when this value is provided by capsule-server
					monthsSubbed: 0,
				}
				subsWithProfiles.push(subWithProfile)
			}
			context.commit(MutationType.RESET)
			subsWithProfiles.forEach((subWithProfile) => {
				if (subWithProfile.isActive) {
					context.commit(MutationType.ADD_ACTIVE, subWithProfile)
					return
				}
				context.commit(MutationType.ADD_INACTIVE, subWithProfile)
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
