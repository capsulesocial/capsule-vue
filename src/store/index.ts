import type { MutationTree } from 'vuex'

export interface RootState {
	nodeURL: string
	backgroundImage: string | null
}

export const state = (): RootState => ({
	nodeURL: ``,
	backgroundImage: null,
})

export const MutationType = {
	CHANGE_NODE: `changeNodeURL`,
	CHANGE_BACKGROUND_IMAGE: `changeBackgroundImage`,
}

export const mutations: MutationTree<RootState> = {
	[MutationType.CHANGE_NODE]: (state, newNodeURL: string) => {
		state.nodeURL = newNodeURL
	},
	[MutationType.CHANGE_BACKGROUND_IMAGE]: (state, newBackgroundImage: string) => {
		state.backgroundImage = newBackgroundImage
	},
}
