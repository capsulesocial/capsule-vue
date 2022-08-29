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

interface Widgets {
	primary: string
	secondary: string
	secondary2: string
}

export const state = (): Widgets => ({
	primary: `feed`,
	secondary: `drafts`,
	secondary2: `tags`,
})

export const MutationType = {
	CHANGE_PRIMARY: `changePrimary`,
	CHANGE_SECONDARY: `changeSecondary`,
	CHANGE_SECONDARY2: `changeSecondary2`,
	RESET: `reset`,
}

export const mutations: MutationTree<Widgets> = {
	[MutationType.CHANGE_PRIMARY]: (state, newPrimary: string) => {
		state.primary = newPrimary
	},
	[MutationType.CHANGE_SECONDARY]: (state, newSecondary: string) => {
		state.secondary = newSecondary
	},
	[MutationType.CHANGE_SECONDARY2]: (state, newSecondary2: string) => {
		state.secondary2 = newSecondary2
	},
	[MutationType.RESET]: (state) => {
		state.primary = `feed`
		state.secondary = `drafts`
		state.secondary2 = `tags`
	},
}
