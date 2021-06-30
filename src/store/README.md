# STORE

Check out [the documentation](https://nuxtjs.org/guide/vuex-store) for usage on Vuex Store

#### authors.js
**Mutations:**
- handleFollow
**States:**

#### posts.js
**Mutations:**
-addShare
-addView
-handleBookmark
-sendPost
-postComment
-commentReply
**States:**
- posts []

#### tags.js
**Mutations:**
-sendPost
**States:**
- tags []


#### draft.js
**Mutations:**
- toggleCompose
- updateDraft
**States:**
draft {}


#### me.js
**Mutations:**
- handleBookmark
- startSession
- sendPost
- updateUsername
- updateID
- updateBio
- addSocial
- removeSocial
- handleFollow
**States:**
- user {} (set on Login)