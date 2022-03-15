import type { MutationTree } from 'vuex'

interface PostPreview {
	title: string
	authorID: string
	featuredPhoto: string | null
	postCID: string
}

export interface RootState {
	nodeURL: string
	backgroundImage: string | null
	recentlyJoined: boolean
	recentBookmarks: Set<PostPreview>
}

export const state = (): RootState => ({
	nodeURL: ``,
	backgroundImage: `/_nuxt/src/assets/images/backgrounds/mainBG.webp`,
	recentlyJoined: false,
	recentBookmarks: new Set(),
})

export const MutationType = {
	CHANGE_NODE: `changeNodeURL`,
	CHANGE_BACKGROUND_IMAGE: `changeBackgroundImage`,
	SET_RECENT_BOOKMARKS: `setRecentBookmarks`,
	WELCOME: `setWelcome`,
	RESET: `reset`,
}

export const mutations: MutationTree<RootState> = {
	[MutationType.CHANGE_NODE]: (state, newNodeURL: string) => {
		state.nodeURL = newNodeURL
	},
	[MutationType.CHANGE_BACKGROUND_IMAGE]: (state, newBackgroundImage: string) => {
		state.backgroundImage = newBackgroundImage
	},
	[MutationType.SET_RECENT_BOOKMARKS]: (state, recentBookmarks) => {
		state.recentBookmarks = new Set()
		state.recentBookmarks = recentBookmarks
	},
	[MutationType.WELCOME]: (state, type: boolean) => {
		state.recentlyJoined = type
	},
	[MutationType.RESET]: (state) => {
		state.nodeURL = ``
		state.backgroundImage = null
		state.recentlyJoined = false
		state.recentBookmarks = new Set()
	},
}
