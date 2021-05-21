/* eslint-disable no-shadow */
export const state = () => ({
  user: null,
})

export const mutations = {
  handleBookmark (state, data) {
    if (!state.user.bookmarks.includes(data.postID)) {
      // Add bookmark
      state.user.bookmarks.push(data.postID)
    } else {
      // Remove bookmark
      state.user.bookmarks = state.user.bookmarks.filter(e => e !== data.postID)
    }
  },
  startSession (state, user) {
    state.user = user
  },
  sendPost (state, postID) {
    state.user.posts.push(postID)
  },
  updateUsername (state, username) {
    state.user.username = username
  },
  updateID (state, id) {
    state.user.id = id
  },
  updateEmail (state, email) {
    state.user.email = email
  },
  updateBio (state, bio) {
    state.user.bio = bio
  },
  addSocial (state, social) {
    state.user.socials.push(social)
  },
  removeSocial (state, social) {
    state.user.socials = state.user.socials.filter(p => p.platform !== social.platform)
  },
  handleFollow (state, userID) {
    // Update current user following list
    for (let f = 0; f < state.user.following.length; f++) {
      if (state.user.following[f] === userID) {
        // Unfollow
        state.user.following = state.user.following.filter(e => e !== userID)
        return
      }
    }
    // Follow
    state.user.following.push(userID)
  },
}
