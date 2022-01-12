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
	reposts: RepostLink[]
	recentlyJoined: boolean
	recentBookmarks: Set<PostPreview>
}

export const state = (): RootState => ({
	nodeURL: ``,
	backgroundImage: null,
	reposts: [],
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
	[MutationType.SET_REPOST]: (state, reposts) => {
		state.reposts = reposts
	},
	[MutationType.ADD_REPOST]: (state, repost: RepostLink) => {
		state.reposts.push(repost)
	},
	[MutationType.REMOVE_REPOST]: (state, repost: RepostLink) => {
		const i = state.reposts.indexOf(repost)
		if (i > -1) {
			state.reposts = state.reposts.splice(i, 1)
		}
	},
	[MutationType.RESET_REPOST]: (state) => {
		state.reposts = []
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
		state.reposts = []
		state.recentlyJoined = false
		state.recentBookmarks = new Set()
	},
}

export const getters = {
	getRepostedPosts: (state: RootState) => {
		const posts: string[] = []
		state.reposts.forEach((r: RepostLink) => {
			posts.push(r.postID)
		})
		return state.reposts
	},
	checkReposts: (state: RootState) => (id: string) => {
		let hasReposted: boolean = false
		state.reposts.forEach((r: RepostLink) => {
			if (r.postID === id) {
				hasReposted = true
			}
		})
		return hasReposted
	},
}
