<template>
	<article class="py-4">
		<h3 class="text-primary text-base font-semibold px-6 pb-4">Recent Bookmarks</h3>
		<nuxt-link
			v-for="p in posts"
			:key="p.postCID"
			:to="`/post/` + p.postCID"
			class="w-full flex flex-row items-center px-6 pb-4"
		>
			<!-- Left side: title and author name -->
			<div class="flex flex-col flex-grow">
				<h5 class="font-semibold">{{ p.title }}</h5>
				<h6 class="text-gray7">By {{ p.authorID }}</h6>
			</div>
			<!-- Right side: featured photo -->
			<img v-if="p.featuredPhoto" :src="p.featuredPhoto" class="flex-shrink-0 h-12 object-contain rounded-lg" />
		</nuxt-link>
		<nuxt-link to="/bookmarks" class="px-6 text-sm italics text-primary">See More</nuxt-link>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import { IPostResponse, getPosts } from '@/backend/post'
import { getPhotoFromIPFS } from '@/backend/photos'

interface PostPreview {
	title: string
	authorID: string
	featuredPhoto: string | null
	postCID: string
}

interface IData {
	bookmarks: IPostResponse[]
	posts: PostPreview[]
}

export default Vue.extend({
	data(): IData {
		return {
			bookmarks: [],
			posts: [],
		}
	},
	async created() {
		this.bookmarks = await getPosts({ bookmarkedBy: this.$store.state.session.id }, this.$store.state.session.id, {
			reposts: false,
		})
		this.bookmarks = this.bookmarks.slice(0, 2)
		this.bookmarks.forEach((p: IPostResponse) => {
			if (p.post.featuredPhotoCID) {
				getPhotoFromIPFS(p.post.featuredPhotoCID).then((res) => {
					const post = { title: p.post.title, authorID: p.post.authorID, featuredPhoto: res, postCID: p.post._id }
					this.posts.push(post)
				})
			} else {
				const post = { title: p.post.title, authorID: p.post.authorID, featuredPhoto: null, postCID: p.post._id }
				this.posts.push(post)
			}
		})
	},
})
</script>
