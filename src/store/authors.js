/* eslint-disable no-shadow */
export const state = () => ([
  {
    id: 'tombrady',
    username: 'Tom Brady',
    email: 'tb12@nfl.com',
    bio: 'Quarterback for the Tampa Bay Buccaneers. Former New England Patriots QB and Pick #199 in the NFL Draft',
    socials: [{ platform: 'twitter', username: 'TomBrady' }],
    posts: ['0'],
    bookmarks: [],
    followers: [],
    following: [],

  },
  {
    id: 'gronk',
    username: 'Rob Gronkowski',
    email: 'rg87@nfl.com',
    bio: 'Creator of the Gronk Spike',
    socials: [{ platform: 'twitter', username: 'gronk' }],
    posts: ['1'],
    bookmarks: [],
    followers: [],
    following: [],
  },
])

export const mutations = {
  handleFollow (state, data) {
    // Adds to target user followers list
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
