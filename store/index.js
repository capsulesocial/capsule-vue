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
        content: '<h3 id="i-d-like-to-thank-my-favorite-teammates-" > I&#39;d like to thank my favorite teammates:</h3><ul><li>Gronk</li><li>Antonio Brown</li></ul><p><img src="https://sportshub.cbsistatic.com/i/r/2021/02/08/e6469274-926d-4b2e-a8e5-c1fadf5b30ec/thumbnail/1200x675/49d05b504125f6231b231b684ef09407/tom-brady-buccaneers-trophy.jpg" alt="Tom Brady Victory"></p>',
        views: 1294,
        timestamp: new Date().toLocaleString()
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
  }
}