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
// import type { Context } from '@nuxt/types'
import type { GetterTree, MutationTree } from 'vuex'
import type { RootState } from './index'
import { Profile } from '@/backend/profile'
export interface Session {
	id: Profile[`id`]
	name: Profile[`name`]
	email: Profile[`email`]
	bio: Profile[`bio`]
	website: Profile[`website`]
	location: Profile[`location`]
	avatar: Profile[`avatar`]
	socials: Profile[`socials`]
	background: Profile[`background`]
	homeFeed: `TOP` | `NEW` | `FOLLOWING`
	cid: string
	subscriptionEnabled: boolean
}

export const namespace = `session`

export const state = (): Session => createDefaultSession(``)

export const getters: GetterTree<Session, RootState> = {}

export const MutationType = {
	CHANGE_CID: `updateCID`,
	CHANGE_ID: `updateID`,
	CHANGE_NAME: `updateName`,
	CHANGE_EMAIL: `updateEmail`,
	CHANGE_AVATAR: `updateAvatar`,
	CHANGE_BIO: `updateBio`,
	CHANGE_LOCATION: `updateLocation`,
	CHANGE_WEBSITE: `updateWebsite`,
	CHANGE_BACKGROUND: `updateBackground`,
	CHANGE_HOMEFEED: `updateHomeFeed`,
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
	[MutationType.CHANGE_WEBSITE]: (state, newWebsite: string) => {
		state.website = newWebsite
	},
	[MutationType.CHANGE_BACKGROUND]: (state, newBackground: string) => {
		state.background = newBackground
	},
	[MutationType.CHANGE_HOMEFEED]: (state, newSorting: `TOP` | `NEW` | `FOLLOWING`) => {
		state.homeFeed = newSorting
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
		Object.assign(state, createDefaultSession(``))
		state.homeFeed = `TOP`
	},
}

/* Helpers */

export function createDefaultSession(id: string): Session {
	return {
		cid: ``,
		id,
		name: ``,
		email: ``,
		bio: ``,
		location: ``,
		socials: [],
		avatar: ``,
		website: ``,
		background: ``,
		homeFeed: id === `` ? `TOP` : `FOLLOWING`,
		subscriptionEnabled: false,
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
		website: s.website,
		background: s.background,
	}
}

export function createSessionFromProfile(cid: string, p: Profile): Session {
	return {
		cid,
		id: p.id,
		name: p.name,
		email: p.email,
		bio: p.bio,
		location: p.location,
		avatar: p.avatar,
		socials: [],
		website: p.website,
		background: p.background,
		homeFeed: p.id === `` ? `TOP` : `FOLLOWING`,
		subscriptionEnabled: true,
	}
}
