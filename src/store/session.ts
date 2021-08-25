// import type { Context } from '@nuxt/types'
import type { GetterTree, MutationTree } from 'vuex'
import type { RootState } from './index'
import { Profile } from '~/interfaces/Profile'

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
	APPEND_POSTCID: `appendPostCID`,
	CHANGE_NAME: `updateName`,
	CHANGE_EMAIL: `updateEmail`,
	CHANGE_AVATAR: `updateAvatar`,
	CHANGE_BIO: `updateBio`,
	CHANGE_LOCATION: `updateLocation`,
	LOGOUT: `logout`,
}

export const mutations: MutationTree<Profile> = {
	[MutationType.CHANGE_CID]: (state, newCID: string) => {
		state.cid = newCID
	},
	[MutationType.CHANGE_ID]: (state, newID: string) => {
		state.id = newID
	},
	[MutationType.APPEND_POSTCID]: (state, postCID: string) => {
		state.posts.push(postCID)
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
	[MutationType.LOGOUT]: (state) => {
		state.cid = ``
		state.id = ``
		state.name = ``
		state.email = ``
		state.avatar = ``
		state.bio = `Default bio.`
		state.location = ``
		state.posts = []
	},
}
