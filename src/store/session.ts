import type { Context } from '@nuxt/types'
import type { GetterTree, ActionTree, MutationTree } from 'vuex'
import type { RootState } from './index'

export const namespace = 'session'

export interface SessionState {
  cid: string,
  id: string,
  name: string,
  email: string,
  password: string,
  bio: string,
  location: string
  posts: string[],
  reposts: [],
  socials: [],
  bookmarks: [],
  categories: [],
  followers: [],
  following: [],
  avatar: string
}

export const state = (): SessionState => ({
  cid: '',
  id: '',
  name: '',
  email: '',
  password: '',
  bio: 'Default bio.',
  location: '',
  posts: [],
  reposts: [],
  socials: [],
  bookmarks: [],
  categories: [],
  followers: [],
  following: [],
  avatar: '',
})

export const getters: GetterTree<SessionState, RootState> = {}

export const MutationType = {
  CHANGE_CID: 'updateCID',
  CHANGE_ID: 'updateID',
  CHANGE_NAME: 'updateName',
  CHANGE_EMAIL: 'updateEmail',
  CHANGE_AVATAR: 'updateAvatar',
  CHANGE_BIO: 'updateBio',
  CHANGE_LOCATION: 'updateLocation',
  ADD_POST: 'addPost',
}

export const mutations: MutationTree<SessionState> = {
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
  [MutationType.ADD_POST]: (state, newPost: string) => {
    state.posts.push(newPost)
  }
}

// export const actionType = {
//   UPDATE_CID: 'updateCID',
// }

// export const actions: ActionTree<SessionState, RootState> = {
//   nuxtServerInit({ commit }, _context: Context) {
//     commit(MutationType.CHANGE_CID, true)
//   },
//   [actionType.UPDATE_CID] ({ commit, state }) {
//     commit(MutationType.CHANGE_CID)
//   }
// }