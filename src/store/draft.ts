import type { GetterTree, MutationTree } from 'vuex'
import type { RootState } from './index'
import { Post } from '~/interfaces/Post'
import { Tag } from '~/interfaces/Tag'

export const namespace = `draft`

export const state = () => ({
	title: ``,
	content: ``,
	featuredPhotoCID: null,
	tags: [],
	category: ``,
})

export const getters: GetterTree<Post, RootState> = {}

export const MutationType = {
	UPDATE_TITLE: `updateTitle`,
	UPDATE_CONTENT: `updateContent`,
	UPDATE_FEATURED_PHOTO_CID: `updateFeaturedPhotoCID`,
	ADD_TAG: `addTag`,
	REMOVE_TAG: `removeTag`,
	UPDATE_CATEGORY: `updateCategory`,
	RESET: `reset`,
}

export const mutations: MutationTree<any> = {
	[MutationType.UPDATE_TITLE]: (state, newTitle: string) => {
		state.title = newTitle
	},
	[MutationType.UPDATE_CONTENT]: (state, newContent: string) => {
		state.content = newContent
	},
	[MutationType.UPDATE_FEATURED_PHOTO_CID]: (state, newFeaturedPhotoCID: string) => {
		state.featuredPhotoCID = newFeaturedPhotoCID
	},
	[MutationType.ADD_TAG]: (state, newTag: Tag) => {
		state.tags.push(newTag)
	},
	[MutationType.REMOVE_TAG]: (state, oldTag: Tag) => {
		const index = state.tags.indexOf(oldTag)
		if (index > -1) {
			state.tags.splice(index, 1)
		}
	},
	[MutationType.UPDATE_CATEGORY]: (state, newCategory: string) => {
		state.category = newCategory
	},
	[MutationType.RESET]: (state) => {
		// eslint-disable-next-line
		state = {
			title: ``,
			content: ``,
			featuredPhotoCID: null,
			tags: [],
			category: ``,
		}
	},
}
