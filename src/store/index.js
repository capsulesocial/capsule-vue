/* eslint-disable no-shadow */
/* eslint-disable quotes */
export const state = () => ({

})

export const mutations = {

  handleFollow (state, userID) {
    // Adds to target user followers list
    for (let i = 0; i < state.userList.length; i++) {
      if (state.userList[i].id === userID) {
        if (!state.userList[i].followers.includes(state.user.id)) {
          state.userList[i].followers.push(state.user.id)
        } else {
          state.userList[i].followers = state.userList[i].followers.filter(e => e !== state.user.id)
        }
      }
    }
  },
  handleBookmark (state, data) {
    const targetPost = state.posts.find(e => e.id === data.postID) // post object
    if (!targetPost.bookmarks.includes(state.user.id)) {
      // add like
      targetPost.bookmarks.push(state.user.id)
      state.user.bookmarks.push(data.postID)
    } else {
      // remove like
      targetPost.bookmarks = targetPost.bookmarks.filter(e => e !== state.user.id)
      state.user.bookmarks = state.user.bookmarks.filter(e => e !== data.postID)
    }
  },
  addShare (state, postID) {
    const targetPost = state.posts.find(p => p.id === postID)
    targetPost.shares += 1
  },
  addView (state, postID) {
    const targetPost = state.posts.find(p => p.id === postID)
    targetPost.views += 1
  },
}
