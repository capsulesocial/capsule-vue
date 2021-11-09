import type { MutationTree } from 'vuex'

interface Widgets {
	primary: string
	secondary: string
}

export const state = (): Widgets => ({
	primary: `feed`,
	secondary: `drafts`,
})

export const MutationType = {
	CHANGE_PRIMARY: `changePrimary`,
	CHANGE_SECONDARY: `changeSecondary`,
}

export const mutations: MutationTree<Widgets> = {
	[MutationType.CHANGE_PRIMARY]: (state, newPrimary: string) => {
		state.primary = newPrimary
	},
	[MutationType.CHANGE_SECONDARY]: (state, newSecondary: string) => {
		state.secondary = newSecondary
	},
}
