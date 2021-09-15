// import type { Context } from '@nuxt/types'
import type { GetterTree, MutationTree } from 'vuex'
import type { RootState } from './index'
import { Profile } from '@/backend/profile'
import { walletLogout, removeNearPrivateKey } from '@/backend/near'
import { removeSigningKey } from '@/backend/keys'
export interface Session {
	id: Profile[`id`]
	name: Profile[`name`]
	email: Profile[`email`]
	bio: Profile[`bio`]
	location: Profile[`location`]
	avatar: Profile[`avatar`]
	socials: Profile[`socials`]
	publicKey: Profile[`publicKey`]
	cid: string
}

export const namespace = `session`

export const state = (): Session => createDefaultSession(``, ``, ``, ``)

export const getters: GetterTree<Session, RootState> = {}

export const MutationType = {
	CHANGE_CID: `updateCID`,
	CHANGE_ID: `updateID`,
	APPEND_POSTCID: `appendPostCID`,
	CHANGE_NAME: `updateName`,
	CHANGE_EMAIL: `updateEmail`,
	CHANGE_PUBLICKEY: `changePublicKey`,
	CHANGE_AVATAR: `updateAvatar`,
	CHANGE_BIO: `updateBio`,
	CHANGE_LOCATION: `updateLocation`,
	LOGOUT: `logout`,
}

export const mutations: MutationTree<Session> = {
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
	[MutationType.CHANGE_PUBLICKEY]: (state, publickey: string) => {
		state.publicKey = publickey
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
		// Remove content-signing key from localStorage
		// when logging out
		removeSigningKey(state.id)
		Object.assign(state, createDefaultSession(``, ``, ``, ``))
		// Remove NEAR private key when logging out.
		// walletLogout() removes only
		// one key-value pair (null_wallet_auth_key)
		// out of two key-value pairs from LocalStorage
		removeNearPrivateKey()
		walletLogout()
	},
}

/* Helpers */

export function createDefaultSession(id: string, name: string, email: string, publicKey: string): Session {
	return {
		cid: ``,
		id,
		name,
		email,
		publicKey,
		bio: ``,
		location: ``,
		socials: [],
		avatar: ``,
	}
}

export function getProfileFromSession(s: Session): Profile {
	return {
		id: s.id,
		name: s.name,
		email: s.email,
		bio: s.bio,
		location: s.location,
		avatar: s.avatar,
		socials: s.socials,
		publicKey: s.publicKey,
	}
}

export function createSessionFromProfile(cid: string, p: Profile): Session {
	return {
		cid,
		id: p.id,
		name: p.name,
		email: p.email,
		publicKey: p.publicKey,
		bio: p.bio,
		location: p.location,
		avatar: p.avatar,
		socials: [],
	}
}
