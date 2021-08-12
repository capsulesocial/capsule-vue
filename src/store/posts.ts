// import type { Context } from '@nuxt/types'
import type { MutationTree } from 'vuex'

import { Tag } from '@/interfaces/Tag'
export const namespace = `posts`

export interface Posts {
	tags: Tag[]
}

export const state = (): Posts => ({
	tags: [],
})

export const postsMutationType = {
	ADD_TAG: `addTag`,
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
}
