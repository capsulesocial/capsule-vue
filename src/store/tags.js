/* eslint-disable array-bracket-newline */
/* eslint-disable no-shadow */
// eslint-disable-next-line array-bracket-newline
export const state = () => ([
	{
		tag: `patriots`,
		posts: [
			`QmayJvVDP4PUsLJDtassNAY8YXoQ5iv8T5Z15psxgWvWbx`,
		],
	},
	{
		tag: `NFL`,
		posts: [`QmayJvVDP4PUsLJDtassNAY8YXoQ5iv8T5Z15psxgWvWbx`],
	},
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
