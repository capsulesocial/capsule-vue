import type { MutationTree } from 'vuex'

export interface RepostLink {
	postID: string
	repostID: string
}

interface PostPreview {
	title: string
	authorID: string
	featuredPhoto: string | null
	postCID: string
}

export interface RootState {
	nodeURL: string
	backgroundImage: string | null
	reposts: Map<string, string>
	recentlyJoined: boolean
	recentBookmarks: Set<PostPreview>
}

export const state = (): RootState => ({
	nodeURL: ``,
	backgroundImage: `/_nuxt/src/assets/images/backgrounds/mainBG.webp`,
	reposts: new Map(),
	recentlyJoined: false,
	recentBookmarks: new Set(),
})

export const MutationType = {
	CHANGE_NODE: `changeNodeURL`,
	CHANGE_BACKGROUND_IMAGE: `changeBackgroundImage`,
	SET_REPOST: `setRepost`,
	ADD_REPOST: `addRepost`,
	REMOVE_REPOST: `removeRepost`,
	RESET_REPOST: `resetRepost`,
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
	[MutationType.SET_REPOST]: (state, reposts: RepostLink[]) => {
		reposts.forEach((repost) => {
			state.reposts.set(repost.postID, repost.repostID)
		})
	},
	[MutationType.ADD_REPOST]: (state, repost: RepostLink) => {
		state.reposts.set(repost.postID, repost.repostID)
	},
	[MutationType.REMOVE_REPOST]: (state, repost: RepostLink) => {
		const repostCIDRecv = state.reposts.get(repost.postID)
		if (!repostCIDRecv) {
			return
		}
		if (repostCIDRecv === repost.repostID) {
			state.reposts.delete(repost.postID)
		}
	},
	[MutationType.RESET_REPOST]: (state) => {
		state.reposts = new Map()
	},
	[MutationType.SET_RECENT_BOOKMARKS]: (state, recentBookmarks) => {
		state.recentBookmarks = new Set()
		state.recentBookmarks = recentBookmarks
		// state.recentBookmarks = recentBookmarks
	},
	[MutationType.WELCOME]: (state, type: boolean) => {
		state.recentlyJoined = type
	},
	[MutationType.RESET]: (state) => {
		state.nodeURL = ``
		state.backgroundImage = null
		state.reposts = new Map()
		state.recentlyJoined = false
		state.recentBookmarks = new Set()
	},
}

export const getters = {
	getRepostedPosts: (state: RootState) => {
		return state.reposts
	},
	checkReposts: (state: RootState) => (id: string) => {
		return Boolean(state.reposts.get(id))
	},
}
