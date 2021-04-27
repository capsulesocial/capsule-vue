export default ({ app }) => ({
  updateID(id, newID) { },
  updateUsername(id, username) { },
  updateEmail(id, email) { },
  updateFollowStatus(actionID, targetID) {
    // Action user is the person who is following or unfollowing the target user
    // Add actionID to targetID.followers
    // Add targetID to actionID.following
  },
  verifySocial(id, platform, handle) { },
  removeSocial(id, platform) { }
});