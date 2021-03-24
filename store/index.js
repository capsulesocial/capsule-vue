export const state = () => ({
  isComposing: false
})

export const mutations = {
  toggleCompose(state) {
    state.isComposing = !state.isComposing
  }
}