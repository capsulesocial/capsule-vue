/* eslint-disable no-shadow */
export const state = () => ({
  posts: [
    {
      id: '0',
      authorID: 'tombrady',
      title: 'I won my 7th Super Bowl!!',
      subtitle: 'Still playing in the NFL at the age of 43',
      content: '#### Thomas Edward Patrick Brady Jr. (born August 3, 1977) is an American football quarterback for the Tampa Bay Buccaneers of the National Football League (NFL). He spent his first 20 seasons with the New England Patriots, where he was a central contributor to the franchise\'s dynasty from 2001 to 2019. Brady is widely considered to be the greatest quarterback of all time![Brady Wins](https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Bucs_WFT_223_%2850833097576%29.jpg/440px-Bucs_WFT_223_%2850833097576%29.jpg 'Optional title') \n ## Super Bowl Championships \n * 2021 \n * 2018 \n * 2016 \n * 2014 \n * 2003 \n * 2001',
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
  ],
})

export const mutations = {
  changeTest (state, value) {
    console.log(value)
    state.test = value
  },
  sendPost (state, post) {
    state.posts.push(post)
    // Add post to tags
    // 1. Check if the tag exists yet
    // 1a. IF tag exists, add CID
    // 1b. ELSE add new tag to post.tags with CID
    for (let i = 0; i < post.tags.length; i++) {
      for (let j = 0; j < state.tags.length; j++) {
        if (state.tags[j].tag === post.tags[i]) {
          state.tags[j].posts.push(post.id)
          return
        }
      }
      state.tags.push({
        tag: post.tags[i],
        posts: [post.id],
      })
    }
  },
  postComment (state, data) {
    const targetPost = state.posts.find(e => e.id === data.postID)
    targetPost.comments.push({ id: targetPost.comments.length, authorID: data.authorID, content: data.content, emotion: data.emotion, timestamp: data.timestamp, replies: data.replies })
  },
  commentReply (state, data) {
    const targetPost = state.posts.find(e => e.id === data.postID)
    const targetComment = targetPost.comments.find(c => c.id === data.commentID)
    targetComment.replies.push({ id: targetComment.replies.length, authorID: data.authorID, content: data.content, timestamp: data.timestamp })
  },
}
