/* eslint-disable no-shadow */
export const state = () => ({
  isComposing: false,
  draft: {
    title: 'Title',
    subtitle: 'Subtitle',
    content: 'Hello\n\nI am honored to participate in this project',
    tags: [],
  },
})

export const mutations = {
  toggleCompose (state) {
    state.isComposing = !state.isComposing
  },
  updateDraft (state, input) {
    state.draft = input
  },
}
