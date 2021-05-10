export default ({ app }) => ({
  updateID (id, newID) {
    return false
  },
  updateUsername (id, username) {
    return false
  },
  updateEmail (id, email) {
    return false
  },
  updateFollowStatus (actionID, targetID) {
    // Action user is the person who is following or unfollowing the target user
    // Add actionID to targetID.followers
    // Add targetID to actionID.following
    return false
  },
  verifySocial (id, platform, handle) {
    return false
  },
  removeSocial (id, platform) {
    return false
  },
})
