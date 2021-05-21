/* eslint-disable no-shadow */
export const state = () => ({
  id: '',
  username: '',
  email: '',
  password: '',
  bio: 'Default bio.',
  posts: [],
  socials: [],
  bookmarks: [],
  followers: [],
  following: [],
})

export const mutations = {
  handleBookmark (state, data) {
    if (!state.bookmarks.includes(data.postID)) {
      // Add bookmark
      state.bookmarks.push(data.postID)
    } else {
      // Remove bookmark
      state.bookmarks = state.bookmarks.filter(e => e !== data.postID)
    }
  },
  startSession (state, user) {
    state.id = user.id
    state.username = user.username
    state.email = user.email
    state.password = user.password
  },
  sendPost (state, postID) {
    state.posts.push(postID)
  },
  updateUsername (state, username) {
    state.username = username
  },
  updateID (state, id) {
    state.id = id
  },
  updateEmail (state, email) {
    state.email = email
  },
  updateBio (state, bio) {
    state.bio = bio
  },
  addSocial (state, social) {
    state.socials.push(social)
  },
  removeSocial (state, social) {
    state.socials = state.socials.filter(p => p.platform !== social.platform)
  },
  handleFollow (state, userID) {
    // Update current user following list
    for (let f = 0; f < state.following.length; f++) {
      if (state.following[f] === userID) {
        // Unfollow
        state.following = state.following.filter(e => e !== userID)
        return
      }
    }
    // Follow
    state.following.push(userID)
  },
}
