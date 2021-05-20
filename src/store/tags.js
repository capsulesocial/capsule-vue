/* eslint-disable no-shadow */
export const state = () => ({
  tags: [
    {
      tag: 'patriots',
      posts: [
        '0',
        '1',
      ],
    },
    {
      tag: 'victory',
      posts: ['0'],
    },
    {
      tag: 'GOAT',
      posts: ['1'],
    },
  ],
})

export const mutations = {
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
}
