import type { Context } from '@nuxt/types'
import type { GetterTree, ActionTree, MutationTree } from 'vuex'
import type { RootState } from './index'

export const namespace = `settings`

export interface SettingState {
	mode: string
	color: string
	recentlyPosted: boolean
	recentlyInSettings: boolean
	lastActivePost: string
	lastActivePostOffset: number
	lastTopAlgorithm: `This week` | `This month` | `This year` | `All time`
	showUnauthPopup: boolean
}

export const state = (): SettingState => createDefaultSetting()

export const getters: GetterTree<SettingState, RootState> = {}

export const MutationType = {
	CHANGE_COLOR_MODE: `changeColorMode`,
	CHANGE_COLOR: `changeColor`,
	SET_RECENTLY_POSTED: `setRecentlyPosted`,
	SET_RECENTLY_IN_SETTINGS: `setRecentlyInSettings`,
	SET_LAST_ACTIVE_POST: `setLastActivePost`,
	SET_LAST_ACTIVE_TOP_ALGORITHM: `setLastActiveTopAlgorithm`,
	TOGGLE_UNAUTH_POPUP: `toggleUnauthPopup`,
	RESET_SETTINGS: `resetSettings`,
}

export const mutations: MutationTree<SettingState> = {
	[MutationType.CHANGE_COLOR_MODE]: (state, newMode: string) => {
		state.mode = newMode
	},
	[MutationType.CHANGE_COLOR]: (state, newColor: string) => {
		state.color = newColor
	},
	[MutationType.SET_RECENTLY_POSTED]: (state, recentlyPosted: boolean) => {
		state.recentlyPosted = recentlyPosted
	},
	[MutationType.SET_RECENTLY_IN_SETTINGS]: (state, recentlyInSettings: boolean) => {
		state.recentlyInSettings = recentlyInSettings
	},
	[MutationType.SET_LAST_ACTIVE_TOP_ALGORITHM]: (
		state,
		algorithm: `This week` | `This month` | `This year` | `All time`,
	) => {
		state.lastTopAlgorithm = algorithm
	},
	[MutationType.SET_LAST_ACTIVE_POST]: (state, data: { newLastActivePost: string; offset: number }) => {
		state.lastActivePost = data.newLastActivePost
		state.lastActivePostOffset = data.offset
	},
	[MutationType.TOGGLE_UNAUTH_POPUP]: (state, c: boolean = !state.showUnauthPopup) => {
		state.showUnauthPopup = c
	},
	[MutationType.RESET_SETTINGS]: (state) => {
		Object.assign(state, createDefaultSetting())
	},
}

export const actionType = {
	TOGGLE_DARK_MODE: `toggleDarkMode`,
}

export const actions: ActionTree<SettingState, RootState> = {
	nuxtServerInit({ commit }, _context: Context) {
		commit(MutationType.CHANGE_COLOR_MODE, `OS`)
		commit(MutationType.CHANGE_COLOR, `Green`)
	},
}

export function createDefaultSetting(): SettingState {
	return {
		mode: `Light`,
		color: `Green`,
		recentlyPosted: false,
		recentlyInSettings: false,
		lastActivePost: ``,
		lastActivePostOffset: 0,
		showUnauthPopup: false,
		lastTopAlgorithm: `This month`,
	}
}
