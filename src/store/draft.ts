import type { GetterTree, MutationTree } from 'vuex'
import type { RootState } from './index'
import { Tag, Post } from '@/backend/post'

export const namespace = `draft`

type DraftPost = Omit<Post, `authorID`>

interface DraftState {
	drafts: Array<DraftPost>
	activeIndex: number
	handleDraftWidget: boolean
}

export const state = (): DraftState => ({
	drafts: [
		{
			title: ``,
			subtitle: ``,
			content: ``,
			featuredPhotoCID: null,
			featuredPhotoCaption: null,
			tags: [],
			category: ``,
			timestamp: 0,
		},
	],
	activeIndex: 0,
	handleDraftWidget: false,
})

export const getters: GetterTree<Post, RootState> = {}

export const MutationType = {
	UPDATE_TITLE: `updateTitle`,
	UPDATE_SUBTITLE: `updateSubtitle`,
	UPDATE_CONTENT: `updateContent`,
	UPDATE_FEATURED_PHOTO_CID: `updateFeaturedPhotoCID`,
	UPDATE_FEATURED_PHOTO_CAPTION: `updateFeaturedPhotoCaption`,
	ADD_TAG: `addTag`,
	REMOVE_TAG: `removeTag`,
	UPDATE_CATEGORY: `updateCategory`,
	SET_TIMESTAMP: `setTimestamp`,
	SET_ACTIVE_DRAFT: `setActiveDraft`,
	CREATE_DRAFT: `createDraft`,
	DELETE_DRAFT: `deleteDraft`,
	RESET: `reset`,
	HANDLE_DRAFT_WIDGET: `handleDraftWidget`,
	CLEAR_DRAFTS: `clearDrafts`,
}

export const mutations: MutationTree<DraftState> = {
	[MutationType.UPDATE_TITLE]: (state, newTitle: string) => {
		state.drafts[state.activeIndex].title = newTitle
	},
	[MutationType.UPDATE_SUBTITLE]: (state, newSubtitle: string) => {
		state.drafts[state.activeIndex].subtitle = newSubtitle
	},
	[MutationType.UPDATE_CONTENT]: (state, newContent: string) => {
		state.drafts[state.activeIndex].content = newContent
	},
	[MutationType.UPDATE_FEATURED_PHOTO_CID]: (state, newFeaturedPhotoCID: string) => {
		state.drafts[state.activeIndex].featuredPhotoCID = newFeaturedPhotoCID
	},
	[MutationType.UPDATE_FEATURED_PHOTO_CAPTION]: (state, newFeaturedPhotoCaption) => {
		state.drafts[state.activeIndex].featuredPhotoCaption = newFeaturedPhotoCaption
	},
	[MutationType.ADD_TAG]: (state, newTag: Tag) => {
		state.drafts[state.activeIndex].tags.push(newTag)
	},
	[MutationType.REMOVE_TAG]: (state, oldTag: Tag) => {
		const index = state.drafts[state.activeIndex].tags.indexOf(oldTag)
		if (index > -1) {
			state.drafts[state.activeIndex].tags.splice(index, 1)
		}
	},
	[MutationType.UPDATE_CATEGORY]: (state, newCategory: string) => {
		state.drafts[state.activeIndex].category = newCategory
	},
	[MutationType.SET_TIMESTAMP]: (state, newTimestamp) => {
		state.drafts[state.activeIndex].timestamp = newTimestamp
	},
	[MutationType.SET_ACTIVE_DRAFT]: (state, index: number) => {
		state.activeIndex = index
	},
	[MutationType.CREATE_DRAFT]: (state) => {
		state.drafts.push({
			title: ``,
			subtitle: ``,
			content: ``,
			featuredPhotoCID: null,
			featuredPhotoCaption: null,
			tags: [],
			category: ``,
			timestamp: 0,
		})
		state.activeIndex = state.drafts.length - 1
	},
	[MutationType.DELETE_DRAFT]: (state, index: number) => {
		state.drafts.splice(index, 1)
		// Check if all drafts are deleted
		if (state.drafts.length === 0) {
			state.drafts.push({
				title: ``,
				subtitle: ``,
				content: ``,
				featuredPhotoCID: null,
				featuredPhotoCaption: null,
				tags: [],
				category: ``,
				timestamp: 0,
			})
			state.activeIndex = 0
		}
		// Check if deleted draft was active
		if (index === state.activeIndex) {
			state.activeIndex = state.drafts.length - 1
		}
	},
	[MutationType.RESET]: (state) => {
		state.drafts.splice(state.activeIndex, 1)
		if (state.drafts.length === 0) {
			state.drafts.push({
				title: ``,
				subtitle: ``,
				content: ``,
				featuredPhotoCID: null,
				featuredPhotoCaption: null,
				tags: [],
				category: ``,
				timestamp: 0,
			})
		}
	},
	[MutationType.HANDLE_DRAFT_WIDGET]: (state, v) => {
		state.handleDraftWidget = v
	},
	[MutationType.CLEAR_DRAFTS]: (state) => {
		state.drafts = [
			{
				title: ``,
				subtitle: ``,
				content: ``,
				featuredPhotoCID: null,
				featuredPhotoCaption: null,
				tags: [],
				category: ``,
				timestamp: 0,
			},
		]
		state.activeIndex = 0
		state.handleDraftWidget = false
	},
}
