export const state = () => ({
  isComposing: false,
  draft: {
    title: "",
    subtitle: "",
    content: "# hello world",
  }
})

export const mutations = {
  toggleCompose(state) {
    state.isComposing = !state.isComposing
  },
  updateDraft(state, input) {
    state.draft = input
  }
}