// import type { Context } from '@nuxt/types'
import type { GetterTree, MutationTree } from 'vuex'
import type { RootState } from './index'
import { BackendProfile, Profile } from '~/interfaces/Profile'
import { walletLogout, removeNearPrivateKey } from '~/plugins/near'

export const namespace = `session`

export const state = (): Profile => createDefaultProfile(``, ``, ``, ``)

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
		// Remove NEAR private key when logging out.
		// walletLogout() removes only
		// one key-value pair (null_wallet_auth_key)
		// out of two key-value pairs from LocalStorage
		removeNearPrivateKey()
		walletLogout()
	},
}

/* Helpers */

export function createDefaultProfile(id: string, name: string, email: string, publicKey: string): Profile {
	return {
		cid: ``,
		id,
		name,
		email,
		publicKey,
		bio: `Default bio.`,
		location: ``,
		posts: [],
		reposts: [],
		socials: [],
		bookmarks: [],
		categories: [],
		comments: [],
		followers: [],
		following: [],
		avatar: ``,
	}
}

export function getBackendProfile(profile: Profile): BackendProfile {
	return {
		id: profile.id,
		name: profile.name,
		email: profile.email,
		bio: profile.bio,
		location: profile.location,
		avatar: profile.avatar,
		socials: profile.socials,
		publicKey: profile.publicKey,
	}
}

export function createProfileFromBackendProfile(cid: string, p: BackendProfile): Profile {
	return {
		cid,
		id: p.id,
		name: p.name,
		email: p.email,
		publicKey: p.publicKey,
		bio: p.bio,
		location: p.location,
		avatar: p.avatar,
		posts: [],
		reposts: [],
		socials: [],
		bookmarks: [],
		categories: [],
		comments: [],
		followers: [],
		following: [],
	}
}
