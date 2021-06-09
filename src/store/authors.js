/* eslint-disable no-shadow */
export const state = () => ([
  {
    id: 'tombrady',
    username: 'Tom Brady',
    email: 'tb12@nfl.com',
    bio: 'Quarterback for the Tampa Bay Buccaneers. Former New England Patriots QB and Pick #199 in the NFL Draft.',
    location: 'The Gym',
    posts: ['QmayJvVDP4PUsLJDtassNAY8YXoQ5iv8T5Z15psxgWvWbx'],
    socials: [],
    bookmarks: [],
    followers: [],
    following: ['tombrady'],
    avatar: 'QmTV5DzEzb3zucoWxcuD9Jvp1yEmnbnaLRtVUypXoC7wgv',
  },
])

export const mutations = {
  handleFollow (state, data) {
    // Adds to target user followers list
    this.$api.authors.handleFollow(data.me, data.targetUser)
    for (let i = 0; i < state.length; i++) {
      if (state[i].id === data.targetUser) {
        if (!state[i].followers.includes(data.me)) {
          state[i].followers.push(data.me)
        } else {
          state[i].followers = state[i].followers.filter(e => e !== data.me)
        }
      }
    }
  },
}
