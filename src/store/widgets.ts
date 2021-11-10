import type { MutationTree } from 'vuex'

interface Widgets {
	primary: string
	secondary: string
	secondary2: string
}

export const state = (): Widgets => ({
	primary: `feed`,
	secondary: `drafts`,
	secondary2: `tags`,
})

export const MutationType = {
	CHANGE_PRIMARY: `changePrimary`,
	CHANGE_SECONDARY: `changeSecondary`,
	CHANGE_SECONDARY2: `changeSecondary2`,
}

export const mutations: MutationTree<Widgets> = {
	[MutationType.CHANGE_PRIMARY]: (state, newPrimary: string) => {
		state.primary = newPrimary
	},
	[MutationType.CHANGE_SECONDARY]: (state, newSecondary: string) => {
		state.secondary = newSecondary
	},
	[MutationType.CHANGE_SECONDARY2]: (state, newSecondary2: string) => {
		state.secondary2 = newSecondary2
	},
}
