/* eslint-disable no-shadow */
export const state = () => ([
  {
    id: '0',
    authorID: 'tombrady',
    title: 'I won my 7th Super Bowl!!',
    subtitle: 'Still playing in the NFL at the age of 43',
    // eslint-disable-next-line no-useless-escape
    content: "#### Thomas Edward Patrick Brady Jr. (born August 3, 1977) is an American football quarterback for the Tampa Bay Buccaneers of the National Football League (NFL). He spent his first 20 seasons with the New England Patriots, where he was a central contributor to the franchise\'s dynasty from 2001 to 2019. Brady is widely considered to be the greatest quarterback of all time![Brady Wins](https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Bucs_WFT_223_%2850833097576%29.jpg/440px-Bucs_WFT_223_%2850833097576%29.jpg 'Optional title') \n ## Super Bowl Championships \n * 2021 \n * 2018 \n * 2016 \n * 2014 \n * 2003 \n * 2001",
    views: 1294,
    shares: 11,
    timestamp: new Date('March 17, 2021 03:24:00'),
    tags: [
      'patriots',
      'victory',
    ],
    comments: [{ id: '0', authorID: 'gronk', content: 'Nice!', emotion: 'agree', timestamp: new Date('March 21, 2021 09:12:00'), replies: [] }],
    bookmarks: [],
  },
  {
    id: '1',
    authorID: 'gronk',
    title: 'Gronk spike!',
    subtitle: 'Tom brady is the GOAT',
    content: 'I like to win football games playing with my best friend **Tom Brady**',
    views: 0,
    shares: 0,
    timestamp: new Date('May 16, 2021 08:51:00'),
    tags: [
      'patriots',
      'GOAT',
    ],
    comments: [{ id: '0', authorID: 'tombrady', content: 'You are my favorite teammate!', emotion: 'agree', timestamp: new Date('May 17, 2021 04:41:00'), replies: [] }],
    bookmarks: [],
  },
])

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
