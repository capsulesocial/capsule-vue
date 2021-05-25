/* eslint-disable no-shadow */
export const state = () => (['QmQpJL3fWF4XvWx15VfW6fV3qgTXm9Y86oN9PChhfbMfPe'])

export const mutations = {
  sendPost (state, post) {
    state.push(post)
  },
  addShare (state, postID) {
    // const targetPost = this.$api.post.getPost(postID)
    const targetPost = state.find(p => p.id === postID)
    targetPost.shares += 1
  },
  addView (state, postID) {
    // const targetPost = this.$api.post.getPost(postID)
    const targetPost = state.find(p => p.id === postID)
    targetPost.views += 1
    this.$api.post.addView(postID)
  },
  handleBookmark (state, data) {
    this.$api.post.handleBookmark(data.userID, data.postID)
    // const targetPost = this.$api.post.getPost(postID)
    const targetPost = state.find(e => e.id === data.postID) // post object
    if (!targetPost.bookmarks.includes(data.userID)) {
      // add like
      targetPost.bookmarks.push(data.userID)
    } else {
      // remove like
      targetPost.bookmarks = targetPost.bookmarks.filter(e => e !== data.userID)
    }
  },
  postComment (state, data) {
    this.$api.post.addComment(data.postID, data.authorID, data.content, data.emotion, data.timestamp, data.replies)
    // const targetPost = this.$api.post.getPost(postID)
    const targetPost = state.find(e => e.id === data.postID)
    targetPost.comments.push({ id: targetPost.comments.length, authorID: data.authorID, content: data.content, emotion: data.emotion, timestamp: data.timestamp, replies: data.replies })
  },
  commentReply (state, data) {
    this.$api.post.addReply(data.postID, data.authorID, data.commentID, data.content, data.timestamp)
    // const targetPost = this.$api.post.getPost(postID)
    const targetPost = state.find(e => e.id === data.postID)
    const targetComment = targetPost.comments.find(c => c.id === data.commentID)
    targetComment.replies.push({ id: targetComment.replies.length, authorID: data.authorID, content: data.content, timestamp: data.timestamp })
  },
}
