<template>
	<div ref="container">
		<article
			v-if="posts.length == 0 && !isLoading"
			class="mt-12 grid justify-items-center overflow-y-hidden px-6 xl:px-0"
		>
			<div v-if="this.$store.state.session.id !== ``" class="flex flex-col items-center">
				<p
					class="text-gray5 dark:text-gray3 align-end mb-1 flex items-end text-sm text-center"
					style="max-width: 400px"
				>
					It seems you don't have any bookmarked posts yet.
				</p>
				<p
					class="text-gray5 dark:text-gray3 align-end mb-5 flex flex-col sm:flex-row items-center sm:items-end text-sm text-center"
					style="max-width: 400px"
				>
					You can bookmark any post by clicking the<span>
						<BookmarkIcon class="h-5 w-5 fill-current" />
					</span>
					icon:
				</p>
				<SecondaryButton :text="`Home`" :action="toggleHomeFeed" />
			</div>
			<div v-else class="dark:text-gray3">
				<button class="text-primary focus:outline-none mr-1" @click="$router.push(`/register`)">Sign up</button>
				to bookmark posts
			</div>
			<img :src="require(`@/assets/images/brand/Bookmarks.webp`)" class="top-0 mt-64 xl:-mt-2" />
		</article>
		<article v-for="p in posts" :key="p.post._id">
			<PostCard
				:repost="p.repost"
				:post="p.post"
				:cid="p.post._id"
				:commentsCount="p.commentsCount"
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
			v-if="noMorePosts"
			class="text-gray5 dark:text-gray3 py-5 text-center text-sm"
			style="backdrop-filter: blur(10px)"
		>
			No more posts
		</p>
		<!-- Not loaded yet -->
		<article v-if="isLoading" class="flex w-full justify-center">
			<div
				class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
				:style="`border-top: 2px solid` + $color.hex"
			></div>
		</article>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
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
		noMorePosts: {
			type: Boolean as PropType<boolean>,
			required: true,
		},
	},
	mounted() {
		const container = this.$refs.container as HTMLElement
		if (container && container.parentNode) {
			container.parentNode.addEventListener(`scroll`, this.handleScroll, true)
		}
	},
	methods: {
		toggleHomeFeed() {
			this.$router.push(`/home`)
		},
		handleScroll(e: Event) {
			if (!this.isLoading) {
				const { scrollTop, scrollHeight, clientHeight } = e.srcElement as HTMLElement
				if (scrollTop + clientHeight >= scrollHeight - 5) {
					this.$emit(`fetchPosts`)
				}
			}
		},
	},
})
</script>
