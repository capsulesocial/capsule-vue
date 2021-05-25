/* eslint-disable no-console */

export default ({ app }, node) => ({

  // Send post to IPFS
  async sendPost (post) {
    const fileAdded = await node.add({
      path: post.title,
      content: JSON.stringify(post),
    })
    const cid = fileAdded.cid.string
    return cid
  },

  // Returns post object associated with content id
  async getPost (cid) {
    let content = ''
    for await (const chunk of node.cat(cid)) {
      content += chunk.toString()
    }
    return JSON.parse(content)
  },
  // Adds OR removes user ID of person who liked the post
  handleBookmark (userID, postID) {
    return false
  },
  addView (postID) {
    return false
  },
  // Adds comment to post
  addComment (postID, authorID, comment, emotion, timestamp, replies) {
    // Return commentID
    return false
  },
  addReply (postID, authorID, commentID, reply, timestamp) {
    // Return replyID
    return false
  },
})
