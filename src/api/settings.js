export default ({ app }) => ({
  updateID(id, newID) { },
  updateUsername(id, username) { },
  updateEmail(id, email) { },
  updateFollowStatus(actionID, targetID) {
    // Action user is the person who is following or unfollowing the target user
    // Add actionID to targetID.followers
    // Add targetID to actionID.following
  },
  verifySocial(id, platform, handle) {
    console.log("ID: " + id)
    console.log("Platform: " + platform)
    console.log("Handle: " + handle)
  },
  removeSocial(id, platform) {
    console.log("Removing the " + platform + " account of " + id)
  }
});