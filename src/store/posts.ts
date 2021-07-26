// import type { Context } from '@nuxt/types'
import type { MutationTree } from 'vuex'

import { Tag } from '@/interfaces/Tag'
import { Post } from '@/interfaces/Post'
export const namespace = `posts`

export interface Posts {
  tags: Tag[],
  recent: Post[]
}

export const state = (): Posts => ({
	tags: [],
	recent: [],
})

export const postsMutationType = {
	ADD_TAG: `addTag`,
	ADD_POST: `addPost`,
}

export const mutations: MutationTree<Posts> = {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	[postsMutationType.ADD_TAG]: (state, newTag: string[]) => {
		for (const t in newTag) {
			if (t) {
				// eslint-disable-next-line no-console
				console.log(t)
				// state.tags.push(newTag)
			}
		}
	},
	[postsMutationType.ADD_POST]: (state, newPost: Post) => {
		state.recent.push(newPost)
	},
}
