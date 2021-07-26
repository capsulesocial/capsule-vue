/* eslint-disable @typescript-eslint/no-unused-vars */
export const state = () => ({})

export const mutations = {
	startSession(state, author) {
		state = author
	},
	endSession(state) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		state = {}
	},
	sendPost(state, postID) {
		// this.$api.settings.sendPost(postID)
		state.posts.push(postID)
	},
	handleRepost(state, postID) {
		if (!state.reposts.includes(postID)) {
			this.$api.settings.addRepost(postID)
			state.reposts.push(postID)
		} else {
			this.$api.settings.removeRepost(postID)
			state.reposts = state.reposts.filter((e) => e !== postID)
		}
	},
	handleBookmark(state, postID) {
		if (!state.bookmarks.includes(postID)) {
			// Add bookmark
			this.$api.settings.addBookmark(postID)
			state.bookmarks.push(postID)
		} else {
			// Remove bookmark
			this.$api.settings.removeBookmark(postID)
			state.bookmarks = state.bookmarks.filter((e) => e !== postID)
		}
	},
	updateUsername(state, username) {
		this.$api.settings.updateUsername(state.id, username)
		state.username = username
	},
	updateID(state, id) {
		this.$api.settings.updateUsername(state.id, id)
		state.id = id
	},
	updateEmail(state, email) {
		this.$api.settings.updateEmail(state.id, email)
		state.email = email
	},
	updateBio(state, bio) {
		this.$api.settings.updateBio(state.id, bio)
		state.bio = bio
	},
	updateLocation(state, location) {
		// this.$api.settings.updateLocation(state.id, location)
		state.location = location
	},
	addSocial(state, social) {
		this.$api.settings.verifySocial(state.id, social.platform, social.username)
		state.socials.push(social)
	},
	removeSocial(state, social) {
		state.socials = state.socials.filter((p) => p.platform !== social.platform)
		this.$api.settings.removeSocial(state.id, social)
	},
	handleFollow(state, userID) {
		// Update current user following list
		for (let f = 0; f < state.following.length; f++) {
			if (state.following[f] === userID) {
				// Unfollow
				state.following = state.following.filter((e) => e !== userID)
				return
			}
		}
		// Follow
		state.following.push(userID)
		this.$api.settings.updateFollowStatus(state.id, userID)
	},
	updateAvatar(state, image) {
		state.avatar = image
	},
}
