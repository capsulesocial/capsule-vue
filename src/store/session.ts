/* eslint-disable no-shadow */
// import type { Context } from '@nuxt/types'
import type { GetterTree, MutationTree } from 'vuex'
import type { RootState } from './index'
import { Profile } from '~/interfaces/Profile'
import { Post } from '~/interfaces/Post'

export const namespace = `session`

export const state = (): Profile => ({
	cid: ``,
	id: ``,
	name: ``,
	email: ``,
	password: ``,
	bio: `Default bio.`,
	location: ``,
	posts: [],
	reposts: [],
	socials: [],
	bookmarks: [],
	categories: [],
	followers: [],
	following: [],
	avatar: ``,
	comments: [],
})

export const getters: GetterTree<Profile, RootState> = {}

export const MutationType = {
	CHANGE_CID: `updateCID`,
	CHANGE_ID: `updateID`,
	CHANGE_NAME: `updateName`,
	CHANGE_EMAIL: `updateEmail`,
	CHANGE_AVATAR: `updateAvatar`,
	CHANGE_BIO: `updateBio`,
	CHANGE_LOCATION: `updateLocation`,
	ADD_POST: `addPost`,
	LOGOUT: `logout`,
}

export const mutations: MutationTree<Profile> = {
	[MutationType.CHANGE_CID]: (state, newCID: string) => {
		state.cid = newCID
	},
	[MutationType.CHANGE_ID]: (state, newID: string) => {
		state.id = newID
	},
	[MutationType.CHANGE_NAME]: (state, newName: string) => {
		state.name = newName
	},
	[MutationType.CHANGE_EMAIL]: (state, newEmail: string) => {
		state.email = newEmail
	},
	[MutationType.CHANGE_AVATAR]: (state, newAvatar: string) => {
		state.avatar = newAvatar
	},
	[MutationType.CHANGE_BIO]: (state, newBio: string) => {
		state.bio = newBio
	},
	[MutationType.CHANGE_LOCATION]: (state, newLocation: string) => {
		state.location = newLocation
	},
	[MutationType.ADD_POST]: (state, newPost: Post) => {
		state.posts.push(newPost)
	},
	[MutationType.LOGOUT]: (state) => {
		// eslint-disable-next-line
		state = {
			cid: ``,
			id: ``,
			name: ``,
			email: ``,
			password: ``,
			bio: `Default bio.`,
			location: ``,
			posts: [],
			reposts: [],
			socials: [],
			bookmarks: [],
			categories: [],
			followers: [],
			following: [],
			avatar: ``,
			comments: [],
		}
	},
}

// export const actionType = {
//   UPDATE_CID: 'updateCID',
// }

// export const actions: ActionTree<SessionState, RootState> = {
//   nuxtServerInit({ commit }, _context: Context) {
//     commit(MutationType.CHANGE_CID, true)
//   },
//   [actionType.UPDATE_CID] ({ commit, state }) {
//     commit(MutationType.CHANGE_CID)
//   }
// }
