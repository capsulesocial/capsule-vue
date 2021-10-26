<template>
	<div>
		<article v-for="p in $props.posts" :key="p.post._id">
			<PostCard
				:post="p.post"
				:bookmarked="p.bookmarked"
				:toggleFriend="toggleFriend"
				:usersFollowing="followingList"
			/>
		</article>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IPostResponse } from '@/backend/post'

export default Vue.extend({
	props: {
		followingList: {
			type: Set,
			required: true,
		},
		toggleFriend: {
			type: Function,
			required: true,
		},
		posts: {
			type: Array as () => IPostResponse[],
			required: true,
		},
	},
})
</script>