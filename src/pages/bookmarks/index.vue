<template>
	<div>
		<article v-if="$props.posts.length == 0" class="grid justify-items-center mt-32">
			<p class="text-sm text-gray5 mb-1 flex items-end align-end" style="max-width: 366px">
				It seems you don't have any bookmarked posts yet,
			</p>
			<p class="text-sm text-gray5 mb-5 flex items-end align-end" style="max-width: 366px">
				you can bookmark any post by clicking the<span>
					<BookmarkIcon class="w-5 h-5 fill-current" />
				</span>
				icon:
			</p>
			<SecondaryButton :text="`Home`" :action="toggleHomeFeed" />
		</article>
		<article v-for="p in $props.posts" :key="p.post._id">
			<PostCard
				:post="p.post"
				:bookmarked="p.bookmarked"
				:toggleFriend="toggleFriend"
				:usersFollowing="followingList"
				:comments="p.comments"
			/>
		</article>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IPostResponse } from '@/backend/post'
import SecondaryButton from '@/components/SecondaryButton.vue'
import BookmarkIcon from '@/components/icons/Bookmark.vue'

export default Vue.extend({
	components: {
		SecondaryButton,
		BookmarkIcon,
	},
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
	methods: {
		toggleHomeFeed() {
			this.$router.push(`/home`)
		},
	},
})
</script>