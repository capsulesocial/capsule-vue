/* eslint-disable no-shadow */
export const state = () => ({
	title: `Title`,
	subtitle: `Subtitle`,
	content: `Hello\n\nI am honored to participate in this project`,
	tags: [],
})

export const mutations = {
	updateDraft (state, input) {
		state.title = input.title
		state.subtitle = input.subtitle
		state.content = input.content
		state.tags = input.tags
	},
}
