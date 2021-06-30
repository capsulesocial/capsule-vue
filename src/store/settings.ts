import type { Context } from '@nuxt/types'
import type { GetterTree, ActionTree, MutationTree } from 'vuex'
import type { RootState } from './index'

export const namespace = 'settings'

export interface SettingState {
  darkMode: boolean
  draftMode: boolean
}

export const state = (): SettingState => ({
  darkMode: false,
  draftMode: false,
})

export const getters: GetterTree<SettingState, RootState> = {}

export const MutationType = {
  CHANGE_DARK_MODE: 'changeDarkMode',
  CHANGE_DRAFT_MODE: 'changeDraftMode',
}

export const mutations: MutationTree<SettingState> = {
  [MutationType.CHANGE_DARK_MODE]: (state, newMode: boolean) => {
    state.darkMode = newMode
  },
  [MutationType.CHANGE_DRAFT_MODE]: (state, newMode: boolean) => {
    state.draftMode = newMode
  },
}

export const actionType = {
  TOGGLE_DARK_MODE: 'toggleDarkMode',
  TOGGLE_DRAFT_MODE: 'toggleDraftMode',
}

export const actions: ActionTree<SettingState, RootState> = {
  nuxtServerInit ({ commit }, _context: Context) {
    commit(MutationType.CHANGE_DARK_MODE, true)
    commit(MutationType.CHANGE_DRAFT_MODE, true)
  },

  [actionType.TOGGLE_DARK_MODE] ({ commit, state }) {
    commit(MutationType.CHANGE_DARK_MODE, !state.darkMode)
  },
  [actionType.TOGGLE_DRAFT_MODE] ({ commit, state }) {
    commit(MutationType.CHANGE_DRAFT_MODE, !state.draftMode)
  },
}