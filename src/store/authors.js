/* eslint-disable no-shadow */
export const state = () => ({
  userList: [
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
  ],
})

export const mutations = {
  handleFollow (state, userID) {
    // Adds to target user followers list
    for (let i = 0; i < state.userList.length; i++) {
      if (state.userList[i].id === userID) {
        if (!state.userList[i].followers.includes(state.user.id)) {
          state.userList[i].followers.push(state.user.id)
        } else {
          state.userList[i].followers = state.userList[i].followers.filter(e => e !== state.user.id)
        }
      }
    }
  },
}
