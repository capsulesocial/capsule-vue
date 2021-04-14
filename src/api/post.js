export default axios => ({
  // POST a post to IPFS
  sendPost() {
    // Call addPost in profile.js
    // Send post to IPFS
  },
  // Returns post object associated with content id 
  getPost(id) { },
  // Adds OR removes user ID of person who liked the post
  handleHeart(userID, postID) { },
  // Adds comment to post
  addComment(postID, comment) { }
})