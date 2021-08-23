// import type { Context } from '@nuxt/types'
import type { GetterTree, MutationTree } from 'vuex'
import type { RootState } from './index'
import { Profile } from '~/interfaces/Profile'
import { walletLogout, removeNearPrivateKey } from '~/plugins/near'

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
	[MutationType.LOGOUT]: (state) => {
		state.cid = ``
		state.id = ``
		state.name = ``
		state.email = ``
		state.avatar = ``
		state.bio = `Default bio.`
		state.location = ``
		state.posts = []
		// Remove NEAR private key when logging out.
		// walletLogout() removes only
		// one key-value pair (null_wallet_auth_key)
		// out of two key-value pairs from LocalStorage
		removeNearPrivateKey()
		walletLogout()
	},
}
