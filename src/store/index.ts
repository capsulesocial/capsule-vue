import type { MutationTree } from 'vuex'

export interface RootState {
	nodeURL: string
}

export const state = (): RootState => ({
	nodeURL: ``,
})

export const MutationType = {
	CHANGE_NODE: `changeNodeURL`,
}

export const mutations: MutationTree<RootState> = {
	[MutationType.CHANGE_NODE]: (state, newNodeURL: string) => {
		state.nodeURL = newNodeURL
	},
}
