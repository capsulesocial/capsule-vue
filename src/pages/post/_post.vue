<template>
	<div v-if="this.post && this.author" class="w-full">
		<HeaderMagic :authorID="this.post.authorID" :avatar="this.authorAvatar" />
		<section v-if="this.post !== {}" class="pb-16 md:pb-5 md:pl-5 m-5 pt-4">
			<!-- Category and elipses -->
			<article class="w-full flex justify-between my-2">
				<div class="text-lg">
					Category |
					<span v-if="!this.post.category" class="text-lightSecondaryText"> None</span>
					<nuxt-link :to="`/discover/` + this.post.category" class="text-primary capitalize">{{
						this.post.category
					}}</nuxt-link>
				</div>
				<MoreIcon />
			</article>
			<article>
				<h1
					:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
					class="font-serif font-semibold text-3xl capitalize leading-loose"
				>
					{{ this.post.title }}
				</h1>
			</article>

			<article class="my-5 flex justify-center">
				<img v-if="this.featuredPhoto !== null" :src="this.featuredPhoto" class="shadow-xl" />
			</article>

			<!-- Author Intro -->
			<article class="flex justify-between mt-5 py-2">
				<div class="flex">
					<img
						v-if="this.authorAvatar"
						:src="this.authorAvatar"
						:alt="this.author.id"
						class="w-10 h-10 rounded-lg mr-4"
					/>
					<p
						:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
						class="font-sans capitalize"
					>
						<nuxt-link
							:to="'/' + this.author.id"
							:class="this.$store.state.settings.darkMode ? 'text-lightActive' : 'text-darkActive'"
							class="underline"
						>
							{{ this.author.name }}
						</nuxt-link>
						<span
							:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
							class="font-sans text-sm block"
						>
							{{ this.$formatDate(this.post.timestamp) }}
						</span>
					</p>
				</div>
				<div>
					<span v-for="s in this.author.socials" :key="s.platform" class="p-2">
						<!-- Twitter -->
						<button
							v-if="s.platform === 'twitter'"
							class="focus:outline-none text-primary"
							@click="openWindow('https://twitter.com/' + s.username)"
						>
							<TwitterIcon />
						</button>
						<!-- GitHub -->
						<button
							v-if="s.platform === 'github'"
							class="focus:outline-none text-primary"
							@click="openWindow('https://github.com/' + s.username)"
						>
							<GitHubIcon />
						</button>
						<button
							v-if="s.platform === 'website'"
							class="focus:outline-none text-primary"
							@click="openWindow(s.username)"
						>
							<ExternalURLIcon />
						</button>
					</span>
				</div>
			</article>

			<!-- <hr v-if="this.$store.state.settings.darkMode" class="style-two my-5" />
			<hr v-else class="style-one my-5" /> -->

			<!-- Content -->
			<article class="mt-5">
				<div
					:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
					class="editable prose max-w-none content"
					v-html="this.content"
				></div>
			</article>

			<!-- Tags -->
			<article class="mt-5">
				<TagCard v-for="t in this.post.tags" :key="t.name" class="mr-2" :tag="t.name" />
			</article>
			<AuthorCard
				:authorAvatar="this.authorAvatar"
				:authorName="this.author.name"
				:authorID="this.author.id"
				:authorBio="this.author.bio"
			/>

			<!-- Comments -->
			<article class="pt-5">
				<!-- Choose reaction -->
				<div class="flex flex-row justify-between">
					<div class="flex items-center">
						<BookmarkButton :postID="this.$route.params.post" />
						<ShareButton :post="this.post" :cid="this.$route.params.post" :class="'z-20'" />
					</div>
				</div>
				<PostActions
					:postCID="this.$route.params.post"
					:authorID="this.author.id"
					:isCommenting="true"
					:tags="this.post.tags"
				/>
			</article>
		</section>
		<section v-else>Post not found 😵‍💫</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
// import markdown from '@/mixins/markdown.ts'
// @ts-ignore
import marked from 'marked'
import PostActions from '@/components/post/Actions.vue'
import AuthorCard from '@/components/AuthorCard.vue'
import TagCard from '@/components/Tag.vue'
import BookmarkButton from '@/components/post/BookmarkButton.vue'
import ShareButton from '@/components/post/Share.vue'
import HeaderMagic from '@/components/HeaderMagic.vue'
import MoreIcon from '@/components/icons/More.vue'

import { getProfile, Profile } from '@/backend/profile'
import { getPost, Post } from '@/backend/post'
import { getPhotoFromIPFS } from '@/backend/photos'

interface IData {
	post: Post | null
	author: Profile | null
	authorAvatar: string | ArrayBuffer | null
	content: string
	featuredPhoto: null | string
	showFilter: boolean
}

export default Vue.extend({
	components: {
		PostActions,
		AuthorCard,
		TagCard,
		BookmarkButton,
		ShareButton,
		HeaderMagic,
		MoreIcon,
	},
	layout: `Reader`,
	// mixins: [markdown],
	data(): IData {
		return {
			post: null,
			author: null,
			authorAvatar: null,
			content: ``,
			featuredPhoto: null,
			showFilter: false,
		}
	},
	async created() {
		// Fetch post from IPFS,
		this.post = await getPost(this.$route.params.post)
		// Get featured photo
		if (this.post.featuredPhotoCID) {
			getPhotoFromIPFS(this.post.featuredPhotoCID).then((p) => {
				this.featuredPhoto = p
			})
		}
		// Convert markdown to HTML
		this.content = marked(this.post.content)
		// Get author profile
		this.author = await getProfile(this.post.authorID)
		if (this.author && this.author.avatar.length > 1) {
			getPhotoFromIPFS(this.author.avatar).then((p) => {
				this.authorAvatar = p
			})
		}
		// Set filter dropdown event handler
		window.addEventListener(
			`click`,
			(e: any): void => {
				if (!e.target) {
					return
				}
				if (
					e.target.parentNode === null ||
					e.target.parentNode.classList === undefined ||
					!e.target.parentNode.classList.contains(`toggle`)
				) {
					this.showFilter = false
				}
			},
			false,
		)
	},
})
</script>

<style>
hr.style-two {
	border: 0;
	height: 1px;
	background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
}
hr.style-one {
	border: 0;
	height: 1px;
	background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.75), rgba(0, 0, 0, 0));
}
.content {
	text-align: justify;
	text-justify: inter-word;
}
</style>
