import type { Context } from '@nuxt/types'
import type { GetterTree, MutationTree } from 'vuex'

import { Tag } from '@/interfaces/Tag'
import post from '@/api/post'


export const namespace = 'posts'


export interface Posts {
  tags: Tag[],
  recent: string[]
}

export const state = (): Posts => ({
  tags: [],
  recent: []
})

export const postsMutationType = {
  ADD_TAG: 'addTag',
}

export const mutations: MutationTree<Posts> = {
  [postsMutationType.ADD_TAG]: (state, newTag: string[]) => {
    for (const t in newTag) {
      console.log(t)
    }
    // state.tags.push(newTag)
  }
}