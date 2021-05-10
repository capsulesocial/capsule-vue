const IPFS = require('ipfs')
// import IPFS from 'ipfs'

export default ({ app }) => ({
  // Send post to IPFS
  async sendPost (post) {
    const node = await IPFS.create()
    const version = await node.version()
    // eslint-disable-next-line no-console
    console.log('IPFS version: ', version.version)
    const fileAdded = await node.add({
      path: post.title,
      content: JSON.stringify(post),
    })
    return fileAdded.cid.string
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
