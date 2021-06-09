/* eslint-disable no-shadow */
export const state = () => (['QmayJvVDP4PUsLJDtassNAY8YXoQ5iv8T5Z15psxgWvWbx'])

export const mutations = {
  sendPost (state, post) {
    state.push(post)
  },
  async handleBookmark (state, data) {
    const targetPost = await this.$api.post.handleBookmark(data.userID, data.postID)
    // const targetPost = state.find(e => e.id === data.postID) // post object
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
