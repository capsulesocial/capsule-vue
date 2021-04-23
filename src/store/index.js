export const state = () => ({
  isComposing: false,
  draft: {
    title: "Title",
    subtitle: "Subtitle",
    content: "# hello world",
  },
  user: {
    id: "tombrady",
    username: "Tom Brady",
    email: "tb12@nfl.com",
    bio: "Quarterback for the Tampa Bay Buccaneers. Former New England Patriots QB and Pick #199 in the NFL Draft",
    socials: [{ "platform": "twitter", "username": "TomBrady" }],
    posts: ["0"],
    bookmarks: [],
    followers: [],
    following: []
  },
  posts: [
    {
      id: "0",
      authorID: "tombrady",
      title: "I won my 7th Super Bowl!!",
      subtitle: "Still playing in the NFL at the age of 43",
      content: '# 2020 Season - Tampa Bay \n #### Thomas Edward Patrick Brady Jr. (born August 3, 1977) is an American football quarterback for the Tampa Bay Buccaneers of the National Football League(NFL).He spent his first 20 seasons with the New England Patriots, where he was a central contributor to the franchise\'s dynasty from 2001 to 2019. Brady is widely considered to be the greatest quarterback of all time![Brady Wins](https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Bucs_WFT_223_%2850833097576%29.jpg/440px-Bucs_WFT_223_%2850833097576%29.jpg "Optional title") ## Super Bowl Championships \n * 2021 \n * 2018 \n * 2016 \n * 2014 \n * 2003 \n * 2001',
      views: 1294,
      timestamp: new Date(),
      comments: [{ id: "0", authorID: "gronk", content: "Nice!", emotion: "agree" }],
      bookmarks: []
    },
    {
      id: "1",
      authorID: "gronk",
      title: "Gronk spike!",
      subtitle: "Tom brady is the GOAT",
      content: 'I like to win football games playing with my best friend **Tom Brady**',
      views: 1,
      timestamp: new Date(),
      comments: [{ id: "0", authorID: "tombrady", content: "You are my favorite teammate!", emotion: "agree" }],
      bookmarks: []
    },
  ]
})

export const mutations = {
  startSession(state, user) {
    state.user = user
  },
  toggleCompose(state) {
    state.isComposing = !state.isComposing
  },
  updateDraft(state, input) {
    state.draft = input
  },
  sendPost(state, post) {
    state.user.posts.push(post.id)
    state.posts.push(post);
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
  updateBio(state, bio) {
    state.user.bio = bio
  },
  addSocial(state, social) {
    state.user.socials.push(social);
  },
  postComment(state, data) {
    let targetPost = state.posts.find(e => e.id === data.postID)
    targetPost.comments.push({ id: targetPost.comments.length, authorID: data.authorID, content: data.content, emotion: data.emotion })
  },
  handleFollow(state, userID) {
    // Update current user following list
    if (state.user.following.indexOf(userID)) {
      // Add
      state.user.following.push(userID)
    } else {
      // Remove 
      state.user.following = state.user.following.filter(e => e !== userID)
    }
    // TODO: Update target user followers list
  },
  handleBookmark(state, data) {
    let targetPost = state.posts.find(e => e.id === data.postID) // post object
    if (targetPost.bookmarks.indexOf(state.user.id) === -1) {
      // add like
      targetPost.bookmarks.push(state.user.id)
      state.user.bookmarks.push(data.postID)
    } else {
      // remove like
      targetPost.bookmarks = targetPost.bookmarks.filter(e => e !== state.user.id)
      state.user.bookmarks = state.user.bookmarks.filter(e => e !== data.postID)
    }
  }
}