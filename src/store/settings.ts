import type { Context } from '@nuxt/types'
import type { GetterTree, ActionTree, MutationTree } from 'vuex'
import type { RootState } from './index'

export const namespace = `settings`

export interface SettingState {
	darkMode: string
	recentlyPosted: boolean
	recentlyInSettings: boolean
	showUnauthPopup: boolean
}

export const state = (): SettingState => ({
	darkMode: `OS`,
	recentlyPosted: false,
	recentlyInSettings: false,
	showUnauthPopup: false,
})

export const getters: GetterTree<SettingState, RootState> = {}

export const MutationType = {
	CHANGE_DARK_MODE: `changeDarkMode`,
	SET_RECENTLY_POSTED: `setRecentlyPosted`,
	SET_RECENTLY_IN_SETTINGS: `setRecentlyInSettings`,
	TOGGLE_UNAUTH_POPUP: `toggleUnauthPopup`,
}

export const mutations: MutationTree<SettingState> = {
	[MutationType.CHANGE_DARK_MODE]: (state, newMode: string) => {
		state.darkMode = newMode
	},
	[MutationType.SET_RECENTLY_POSTED]: (state, recentlyPosted: boolean) => {
		state.recentlyPosted = recentlyPosted
	},
	[MutationType.SET_RECENTLY_IN_SETTINGS]: (state, recentlyInSettings: boolean) => {
		state.recentlyInSettings = recentlyInSettings
	},
	[MutationType.TOGGLE_UNAUTH_POPUP]: (state, c: boolean = !state.showUnauthPopup) => {
		state.showUnauthPopup = c
	},
}

export const actionType = {
	TOGGLE_DARK_MODE: `toggleDarkMode`,
}

export const actions: ActionTree<SettingState, RootState> = {
	nuxtServerInit({ commit }, _context: Context) {
		commit(MutationType.CHANGE_DARK_MODE, `OS`)
	},
}
