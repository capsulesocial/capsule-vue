export default ({ app }, node) => ({
  startSession (authorID) {
    // Return the author object
    return authorID
  },
  async uploadAvatar (image) {
    const fileAdded = await node.add(image)
    const cid = fileAdded.cid.string
    return cid
  },
  async downloadAvatar (cid) {
    let content = ''
    for await (const chunk of node.cat(cid)) {
      content += chunk.toString()
    }
    return content
  },
  sendPost (postID) {
    // Passing in ID of post to be added to author posts array
    // I can pass you the updated array to override
    return postID
  },
  addBookmark (postID) {
    // postID: new post that is being added
    // Jack can also pass in the updated bookmarks list with postID added
    return postID
  },
  removeBookmark (postID) {
    // postID: new post that is being added
    // Jack can also pass in the updated bookmarks list with postID removed
    return postID
  },
  updateUsername (authorID, username) {
    return false
  },
  updateID (authorID, newID) {
    return false
  },
  updateEmail (authorID, email) {
    return false
  },
  updateBio (authorID, bio) {
    return false
  },
  verifySocial (authorID, platform, handle) {
    return false
  },
  updateFollowStatus (actionID, targetID) {
    // Action user is the person who is following or unfollowing the target user
    // Add actionID to targetID.followers
    // Add targetID to actionID.following
    return false
  },

  removeSocial (id, platform) {
    return false
  },
})
