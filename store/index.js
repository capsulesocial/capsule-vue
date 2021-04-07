export const state = () => ({
  isComposing: false,
  draft: {
    title: "",
    subtitle: "",
    content: "# hello world",
  },
  user: {
    id: "tombrady",
    username: "Tom Brady",
    email: "tb12@nfl.com",
    posts: [
      {
        id: "0",
        title: "I won my 7th Super Bowl!",
        subtitle: "Still playing in the NFL at the age of 43",
        content: '# 2020 Season - Tampa Bay \n #### Thomas Edward Patrick Brady Jr. (born August 3, 1977) is an American football quarterback for the Tampa Bay Buccaneers of the National Football League(NFL).He spent his first 20 seasons with the New England Patriots, where he was a central contributor to the franchise\'s dynasty from 2001 to 2019. Brady is widely considered to be the greatest quarterback of all time![Brady Wins](https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Bucs_WFT_223_%2850833097576%29.jpg/440px-Bucs_WFT_223_%2850833097576%29.jpg "Optional title") ## Super Bowl Championships \n * 2021 \n * 2018 \n * 2016 \n * 2014 \n * 2003 \n * 2001',
        views: 1294,
        timestamp: new Date(),
        comments: [{ id: "0", authorID: "gronk", content: "Nice!" }],
        likes: []
      }
    ]
  }
})

export const mutations = {
  toggleCompose(state) {
    state.isComposing = !state.isComposing
  },
  updateDraft(state, input) {
    state.draft = input
  },
  sendPost(state, post) {
    state.user.posts.push(post);
  },
  updateUsername(state, username) {
    state.user.username = username
  },
  updateID(state, id) {
    state.user.id = id
  },
  updateEmail(state, email) {
    state.user.email = email
  },
  postComment(state, data) {
    let targetUser = state.user
    let targetPost = targetUser.posts.find(e => e.id === data.postID)
    targetPost.comments.push({ id: targetPost.comments.length, authorID: data.authorID, content: data.content })
  },
  handleHeart(state, data) {
    // let targetAuthor = data.authorID
    let targetAuthor = state.user // get user who post belongs to
    let targetPost = targetAuthor.posts.find(e => e.id === data.postID) // post object
    if (targetPost.likes.indexOf(state.user.id) === -1) {
      // add like
      targetPost.likes.push(state.user.id)
    } else {
      // remove like
      targetPost.likes = targetPost.likes.filter(e => e !== state.user.id)
    }
  }
}