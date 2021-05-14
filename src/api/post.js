/* eslint-disable no-console */
const IPFS = require('ipfs')

export default ({ app }) => ({

  // Send post to IPFS
  async sendPost (post) {
    const node = await IPFS.create()
    const version = await node.version()
    console.log('IPFS version: ', version.version)
    const fileAdded = await node.add({
      path: post.title,
      content: JSON.stringify(post),
    })
    const cid = fileAdded.cid.string
    for await (const chunk of node.cat(cid)) {
      console.info(chunk)
    }
    await node.stop()
    return cid
    // Call addPost in profile.js
  },

  // Returns post object associated with content id
  getPost (id) {
    return false
  },
  // Adds OR removes user ID of person who liked the post
  handleBookmark (userID, postID) {
    return false
  },
  // Adds comment to post
  addComment (postID, comment) {
    return false
  },
})
