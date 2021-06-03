/* eslint-disable no-shadow */
export const state = () => ({
  id: '',
  username: '',
  email: '',
  password: '',
  bio: 'Default bio.',
  location: '',
  posts: [],
  socials: [],
  bookmarks: [],
  followers: [],
  following: [],
})

export const mutations = {
  startSession (state, author) {
    this.$api.settings.startSession(author.id)
    state.id = author.id
    state.username = author.username
    state.email = author.email
    state.password = author.password
  },
  endSession (state) {
    state = {}
  },
  sendPost (state, postID) {
    this.$api.settings.sendPost(postID)
    state.posts.push(postID)
  },
  handleBookmark (state, postID) {
    if (!state.bookmarks.includes(postID)) {
      // Add bookmark
      this.$api.settings.addBookmark(postID)
      state.bookmarks.push(postID)
    } else {
      // Remove bookmark
      this.$api.settings.removeBookmark(postID)
      state.bookmarks = state.bookmarks.filter(e => e !== postID)
    }
  },
  updateUsername (state, username) {
    this.$api.settings.updateUsername(state.id, username)
    state.username = username
  },
  updateID (state, id) {
    this.$api.settings.updateUsername(state.id, id)
    state.id = id
  },
  updateEmail (state, email) {
    this.$api.settings.updateEmail(state.id, email)
    state.email = email
  },
  updateBio (state, bio) {
    this.$api.settings.updateBio(state.id, bio)
    state.bio = bio
  },
  addSocial (state, social) {
    this.$api.settings.verifySocial(state.id, social.platform, social.username)
    state.socials.push(social)
  },
  removeSocial (state, social) {
    state.socials = state.socials.filter(p => p.platform !== social.platform)
    this.$api.settings.removeSocial(state.id, social)
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
    this.$api.settings.updateFollowStatus(state.id, userID)
  },
}
