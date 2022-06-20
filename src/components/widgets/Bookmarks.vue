<template>
	<article class="py-4">
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText px-6 pb-4 text-base font-semibold">Recent Bookmarks</h3>
		<article v-if="recentBookmarks.length == 0">
			<p class="text-gray5 dark:text-gray3 mb-4 px-6 text-sm">
				<span>
					You haven't bookmarked any posts yet. Click the bookmark icon on a post to add it to your bookmark list
				</span>
			</p>
		</article>
		<nuxt-link
			v-for="p in recentBookmarks"
			:key="p.cid"
			:to="`/post/` + p.cid"
			class="flex w-full flex-row items-center px-6 pb-4"
		>
			<!-- Left side: title and author name -->
			<div class="flex flex-grow flex-col">
				<h5 class="font-semibold dark:text-darkSecondaryText">{{ p.title }}</h5>
				<h6 class="text-gray5 dark:text-gray3">By {{ p.author }}</h6>
			</div>
			<!-- Right side: featured photo -->
			<div class="w-24 hidden xl:block">
				<img v-if="p.featuredPhoto" :src="p.featuredPhoto" class="h-16 w-full flex-shrink-0 rounded-lg object-cover" />
			</div>
		</nuxt-link>
		<nuxt-link to="/bookmarks" class="italics text-primary px-6 text-sm">Show all</nuxt-link>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import { getBookmarksOfUser } from '@/backend/bookmarks'
import type { IPostResponse } from '@/backend/post'
import { getPhotoFromIPFS } from '@/backend/getPhoto'

interface PostPreview {
	title: string
	author: string
	featuredPhoto: string | ArrayBuffer | null
	cid: string
}

interface IData {
	recentBookmarks: PostPreview[]
}

export default Vue.extend({
	data(): IData {
		return {
			recentBookmarks: [],
		}
	},
	async created() {
		await this.fetchBookmarks()
	},
	methods: {
		async fetchBookmarks() {
			this.recentBookmarks = []
			let res = await getBookmarksOfUser(this.$store.state.session.id)
			res = res.slice(0, 2)
			// Convert post objects into preview
			res.forEach((p: IPostResponse) => {
				const newP: PostPreview = { title: p.post.title, author: p.post.authorID, cid: p.post._id, featuredPhoto: null }
				if (p.post.featuredPhotoCID && p.post.featuredPhotoCID !== ``) {
					getPhotoFromIPFS(p.post.featuredPhotoCID).then((photo) => {
						newP.featuredPhoto = photo
					})
				}
				this.recentBookmarks.push(newP)
			})
		},
	},
})
</script>
