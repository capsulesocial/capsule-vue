import type { MutationTree } from 'vuex'

interface Widgets {
	primary: string
}

export const state = (): Widgets => ({
	primary: `feed`,
})

export const MutationType = {
	CHANGE_PRIMARY: `changePrimary`,
}

export const mutations: MutationTree<Widgets> = {
	[MutationType.CHANGE_PRIMARY]: (state, newPrimary: string) => {
		state.primary = newPrimary
	},
}
