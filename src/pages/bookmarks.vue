<template>
	<div>
		<div class="flex flex-col sm:flex-row items-center justify-between px-5 pt-3 pb-3 xl:px-6 xl:pt-4">
			<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-lg font-semibold xl:text-xl">My bookmarks</h2>
			<BookmarksFilter class="modal-animation mt-2 sm:mt-0" :filter="filter" @clicked="setSort" />
		</div>
		<div class="min-h-120 h-120 lg:min-h-220 lg:h-220 w-full overflow-y-auto">
			<nuxt-child
				:posts="posts"
				:followingList="following"
				:toggleFriend="toggleFriend"
				:isLoading="isLoading"
				:noMorePosts="noMorePosts"
				@fetchPosts="handleScroll"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { followChange, getFollowersAndFollowing } from '@/backend/following'
import { IPostResponse } from '@/backend/post'
import BookmarksFilter from '@/components/BookmarksFilter.vue'
import { BookmarkSort } from '@/backend/bookmarks'

interface IData {
	following: Set<string>
}

export default Vue.extend({
	components: {
		BookmarksFilter,
	},
	layout: `bookmarks`,
	props: {
		posts: {
			type: Array as () => IPostResponse[],
			required: true,
		},
		isLoading: {
			type: Boolean,
			required: false,
		},
		filter: {
			type: String,
			default: `BOOKMARK_DESC`,
		},
		noMorePosts: {
			type: Boolean as PropType<boolean>,
			required: true,
		},
	},
	data(): IData {
		return {
			following: new Set(),
		}
	},
	head() {
		return {
			title: `Bookmarks - Blogchain`,
			meta: [{ hid: `bookmarks`, name: `bookmarks`, content: `View your bookmarked posts` }],
		}
	},
	created() {
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			return
		}
		getFollowersAndFollowing(this.$store.state.session.id).then(({ following }) => {
			this.following = following
		})
	},
	methods: {
		async toggleFriend(authorID: string) {
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			if (authorID !== this.$store.state.session.id) {
				await followChange(this.following.has(authorID) ? `UNFOLLOW` : `FOLLOW`, this.$store.state.session.id, authorID)
				const data = await getFollowersAndFollowing(this.$store.state.session.id, true)
				this.following = data.following
			}
		},
		setSort(sort: BookmarkSort) {
			// When a user selects a filter
			this.$emit(`clicked`, sort)
		},
		handleScroll() {
			this.$emit(`fetchPosts`)
		},
	},
})
</script>
