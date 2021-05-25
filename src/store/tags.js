/* eslint-disable array-bracket-newline */
/* eslint-disable no-shadow */
// eslint-disable-next-line array-bracket-newline
export const state = () => ([
  // {
  //   tag: 'patriots',
  //   posts: [
  //     '0',
  //     '1',
  //   ],
  // },
  // {
  //   tag: 'victory',
  //   posts: ['0'],
  // },
  // {
  //   tag: 'GOAT',
  //   posts: ['1'],
  // },
])

export const mutations = {
  sendPost (state, post) {
    // Add post tags
    // 1. Check if the tag exists yet
    // 1a. IF tag exists, add CID
    // 1b. ELSE add new tag to post.tags with CID
    for (let i = 0; i < post.tags.length; i++) {
      for (let j = 0; j < state.length; j++) {
        if (state[j].tag === post.tags[i]) {
          state[j].posts.push(post.id)
          return
        }
      }
      state.push({
        tag: post.tags[i],
        posts: [post.id],
      })
    }
  },
}
