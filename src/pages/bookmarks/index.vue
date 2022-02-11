<template>
	<div>
		<article
			v-if="posts.length == 0 && !isLoading"
			class="mt-12 grid justify-items-center overflow-y-hidden px-6 xl:px-0"
		>
			<p class="text-gray5 dark:text-gray3 align-end mb-1 flex items-end text-sm" style="max-width: 366px">
				It seems you don't have any bookmarked posts yet,
			</p>
			<p class="text-gray5 dark:text-gray3 align-end mb-5 flex items-end text-sm" style="max-width: 366px">
				you can bookmark any post by clicking the<span>
					<BookmarkIcon class="h-5 w-5 fill-current" />
				</span>
				icon:
			</p>
			<SecondaryButton :text="`Home`" :action="toggleHomeFeed" />
			<img :src="require(`@/assets/images/brand/Bookmarks.webp`)" class="top-0 mt-64 xl:-mt-2" />
		</article>
		<article v-for="p in posts" :key="p.post._id">
			<PostCard
				:repost="p.repost"
				:post="p.post"
				:cid="p.post._id"
				:comments="p.comments"
				:toggleFriend="toggleFriend"
				:usersFollowing="followingList"
				:repostedBy="p.repost ? p.repost.authorID : undefined"
				:bookmarked="p.bookmarked"
				:hideRepostIcon="true"
				:bookmarksCount="p.bookmarksCount"
				:repostCount="p.repostCount"
				:isDeleted="p.deleted"
			/>
		</article>
		<p
			v-if="posts.length > 0"
			class="text-gray5 dark:text-gray3 py-5 text-center text-sm"
			style="backdrop-filter: blur(10px)"
		>
			No more posts
		</p>
		<!-- Not loaded yet -->
		<article v-if="isLoading" class="flex w-full justify-center">
			<div class="loader modal-animation m-6"></div>
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
		isLoading: {
			type: Boolean,
			required: false,
		},
	},
	methods: {
		toggleHomeFeed() {
			this.$router.push(`/home`)
		},
	},
})
</script>
