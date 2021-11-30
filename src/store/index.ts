import type { MutationTree } from 'vuex'

export interface RepostLink {
	postID: string
	repostID: string
}

export interface RootState {
	nodeURL: string
	backgroundImage: string | null
	reposts: RepostLink[]
}

export const state = (): RootState => ({
	nodeURL: ``,
	backgroundImage: null,
	reposts: [],
})

export const MutationType = {
	CHANGE_NODE: `changeNodeURL`,
	CHANGE_BACKGROUND_IMAGE: `changeBackgroundImage`,
	SET_REPOST: `setRepost`,
	ADD_REPOST: `addRepost`,
	REMOVE_REPOST: `removeRepost`,
	RESET_REPOST: `ressetRepost`,
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
