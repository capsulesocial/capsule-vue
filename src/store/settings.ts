import type { Context } from '@nuxt/types'
import type { GetterTree, ActionTree, MutationTree } from 'vuex'
import type { RootState } from './index'

export const namespace = `settings`

export interface SettingState {
	darkMode: boolean
	recentlyPosted: boolean
	showUnauthPopup: boolean
}

export const state = (): SettingState => ({
	darkMode: true,
	recentlyPosted: false,
	showUnauthPopup: false,
})

export const getters: GetterTree<SettingState, RootState> = {}

export const MutationType = {
	CHANGE_DARK_MODE: `changeDarkMode`,
	SET_RECENTLY_POSTED: `setRecentlyPosted`,
	TOGGLE_UNAUTH_POPUP: `toggleUnauthPopup`,
}

export const mutations: MutationTree<SettingState> = {
	[MutationType.CHANGE_DARK_MODE]: (state, newMode: boolean) => {
		state.darkMode = newMode
	},
	[MutationType.SET_RECENTLY_POSTED]: (state, recentlyPosted: boolean) => {
		state.recentlyPosted = recentlyPosted
	},
	[MutationType.TOGGLE_UNAUTH_POPUP]: (state) => {
		state.showUnauthPopup = !state.showUnauthPopup
	},
}

export const actionType = {
	TOGGLE_DARK_MODE: `toggleDarkMode`,
}

export const actions: ActionTree<SettingState, RootState> = {
	nuxtServerInit({ commit }, _context: Context) {
		commit(MutationType.CHANGE_DARK_MODE, true)
	},

	[actionType.TOGGLE_DARK_MODE]({ commit, state }) {
		commit(MutationType.CHANGE_DARK_MODE, !state.darkMode)
	},
}
