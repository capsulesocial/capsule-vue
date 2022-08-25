/*
 * Copyright (c) 2021-2022 Capsule Social, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */
import type { MutationTree } from 'vuex'

export interface RepostLink {
	postID: string
	repostID: string
}

export interface RootState {
	nodeURL: string
	backgroundImage: string | null
	reposts: { [key: string]: string }
	recentlyJoined: boolean
}

export const state = (): RootState => ({
	nodeURL: ``,
	backgroundImage: `/_nuxt/src/assets/images/backgrounds/mainBG.webp`,
	reposts: {},
	recentlyJoined: false,
})

export const MutationType = {
	CHANGE_NODE: `changeNodeURL`,
	CHANGE_BACKGROUND_IMAGE: `changeBackgroundImage`,
	SET_REPOST: `setRepost`,
	ADD_REPOST: `addRepost`,
	REMOVE_REPOST: `removeRepost`,
	RESET_REPOST: `resetRepost`,
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
		state.reposts[repost.postID] = repost.repostID
	},
	[MutationType.REMOVE_REPOST]: (state, postID: string) => {
		delete state.reposts[postID]
	},
	[MutationType.RESET_REPOST]: (state) => {
		state.reposts = {}
	},
	[MutationType.WELCOME]: (state, type: boolean) => {
		state.recentlyJoined = type
	},
	[MutationType.RESET]: (state) => {
		state.nodeURL = ``
		state.backgroundImage = null
		state.reposts = {}
		state.recentlyJoined = false
	},
}

export const getters = {
	getRepostedPosts: (state: RootState) => {
		return state.reposts
	},
	checkReposts: (state: RootState) => (id: string) => {
		return Boolean(state.reposts[id])
	},
}
