<template>
	<div
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="$emit(`close`)"
	>
		<!-- Container -->
		<section class="popup w-full lg:w-11/12 xl:w-10/12 max-w-1220" style="margin-top: 88px">
			<div
				id="post"
				class="w-full h-full bg-lightBG dark:bg-darkBGStop card-animation z-10 overflow-y-auto rounded-t-lg shadow-lg flex justify-center"
			>
				<!-- Inner post area -->
				<div class="w-full lg:w-760 lg:max-w-760 h-fit">
					<!-- Magic header that disappears on scroll down -->
					<header
						id="header"
						class="page-header bg-lightBG dark:bg-darkBG border-b border-r border-l border-lightBorder shadow-sm sticky top-0 z-10 flex w-full items-center rounded-b-lg py-2 px-5"
					>
						<div class="trigger-menu-wrapper flex w-full justify-center py-2 ease-in-out">
							<div class="flex w-full justify-between xl:min-w-max xl:max-w-3xl">
								<!-- Eyecon and preview mode text -->
								<div class="flex items-center">
									<PreviewIcon class="text-gray5 dark:text-gray3" />
									<h6 class="text-xs lg:text-sm text-gray5 dark:text-gray3 ml-4">Preview Mode</h6>
								</div>
								<span class="flex items-center">
									<button
										class="focus:outline-none bg-primary text-lightButtonText transform rounded-lg px-8 py-2 font-bold shadow-lg transition duration-500 ease-in-out hover:scale-105"
										@click="$emit(`confirm`)"
									>
										Ready to publish?
									</button>
									<button
										class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1 ml-4"
										@click="$emit(`close`)"
									>
										<XIcon />
									</button>
								</span>
							</div>
						</div>
					</header>
					<section class="mb-5 px-5 lg:px-0 pb-16 pt-2 md:pb-5">
						<!-- Title, subtitle, category -->
						<h6 class="text-primary capitalize my-5">{{ post.category.replace(`-`, ` `) }}</h6>
						<article>
							<h1
								class="text-lightPrimaryText dark:text-darkPrimaryText text-h1 mb-3 break-words font-serif font-semibold"
							>
								{{ post.title }}
							</h1>
							<h2
								v-if="post.subtitle"
								class="text-lightSecondaryText dark:text-gray3 text-h2 mb-3 break-words font-serif font-medium"
							>
								{{ post.subtitle }}
							</h2>
						</article>
						<!-- Featured photo & caption -->
						<article v-if="post.featuredPhoto !== null" class="relative mb-5 mt-5 flex flex-col justify-end">
							<div
								v-if="post && post.featuredPhotoCaption && captionHeight !== undefined"
								class="absolute w-full rounded-b-lg"
								:class="
									captionHeight > 72 ? `h-48` : captionHeight > 52 ? `h-40` : captionHeight > 32 ? `h-32` : `h-24`
								"
								style="background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)"
							></div>
							<img :src="featuredPhoto" class="w-full rounded-lg object-cover shadow-lg" />
							<p
								v-if="post && post.featuredPhotoCaption"
								id="photoCaption"
								class="text-lightOnPrimaryText absolute px-4 pb-3 text-sm drop-shadow-lg"
								style="text-shadow: 0 0 10px #000"
							>
								{{ post.featuredPhotoCaption }}
							</p>
						</article>
						<!-- Content -->
						<article class="mt-5">
							<div class="text-lightPrimaryText dark:text-darkSecondaryText editable content max-w-none break-words">
								<PostPreview
									:content="previewContent"
									:postImages="post.postImages"
									:encrypted="false"
									:postImageKeys="post.postImages"
								/>
							</div>
						</article>
						<!-- Tags -->
						<article class="mt-5 text-lg">
							<TagCard v-for="t in post.tags" :key="t.name" class="mr-2 mb-2" :tag="t.name" />
						</article>
						<!-- Ready to post footer -->
						<article class="my-5 border-t border-b py-5 dark:border-gray7">
							<div class="flex w-full justify-between xl:min-w-max xl:max-w-3xl">
								<!-- Eyecon and preview mode text -->
								<div class="flex items-center">
									<PreviewIcon class="text-gray5 dark:text-gray3" />
									<h6 class="text-xs lg:text-sm text-gray5 dark:text-gray3 ml-4">Preview Mode</h6>
								</div>
								<span class="flex items-center">
									<button
										class="focus:outline-none bg-primary text-lightButtonText transform rounded-lg px-8 py-2 font-bold shadow-lg transition duration-500 ease-in-out hover:scale-105"
										@click="$emit(`confirm`)"
									>
										Ready to publish?
									</button>
								</span>
							</div>
						</article>
					</section>
					<!-- {{ post }} -->
				</div>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import PreviewIcon from '@/components/icons/Preview.vue'
import XIcon from '@/components/icons/X.vue'
import PostPreview from '@/components/PostPreview.vue'
import TagCard from '@/components/Tag.vue'

import { Post } from '@/backend/post'
import { getPhotoFromIPFS } from '@/backend/getPhoto'

interface IData {
	post: Post
	featuredPhoto: null | string
	captionHeight?: number
	lastScroll: number
}

export default Vue.extend({
	components: { PreviewIcon, XIcon, PostPreview, TagCard },
	props: {
		previewContent: {
			type: String,
			required: true,
		},
	},
	data(): IData {
		const p = this.$store.state.draft.drafts[this.$store.state.draft.activeIndex]
		return {
			post: p,
			featuredPhoto: null,
			captionHeight: 0,
			lastScroll: 0,
		}
	},
	created() {
		if (this.post.featuredPhotoCID) {
			getPhotoFromIPFS(this.post.featuredPhotoCID).then((p) => {
				this.featuredPhoto = p
			})
		}
	},
	mounted() {
		// Get caption height
		const caption = document.getElementById(`photoCaption`)
		this.captionHeight = caption?.offsetHeight
		const container = document.getElementById(`post`)
		if (container) {
			container.addEventListener(`scroll`, this.handleScroll)
		}
	},
	methods: {
		handleScroll() {
			const body = document.getElementById(`post`)
			const header = document.getElementById(`header`)
			const scrollUp = `scroll-up`
			const scrollDown = `scroll-down`
			if (!body) {
				return
			}
			const currentScroll = body.scrollTop
			if (!header) {
				return
			}
			if (body.scrollTop <= 0) {
				header.classList.remove(scrollUp)
				return
			}
			if (currentScroll > this.lastScroll && !header.classList.contains(scrollDown)) {
				// down
				header.classList.remove(scrollUp)
				header.classList.add(scrollDown)
			} else if (currentScroll < this.lastScroll && header.classList.contains(scrollDown)) {
				// up
				header.classList.remove(scrollDown)
				header.classList.add(scrollUp)
			}
			this.lastScroll = currentScroll
		},
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
.trigger-menu-wrapper {
	transition: all 0.4s;
	z-index: 50;
}
.page-header {
	transition: all 0.3s ease-in-out;
}
.trigger-menu-wrapper {
	transition: all 0.4s;
}
.scroll-down {
	opacity: 0;
	transform: translate3d(0, -20%, 0);
}
.scroll-up {
	opacity: 1;
	transform: none;
}
ol {
	margin-left: 0;
}
ol ol {
	margin-left: 8em;
}
ol li {
	list-style-type: none;
	counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
	counter-increment: list-0;
}
ol li::before {
	content: counter(list-0, decimal) '. ';
}
ol li.ql-indent-1 {
	counter-increment: list-1;
}
ol li.ql-indent-1::before {
	content: counter(list-1, lower-alpha) '. ';
}
ol li.ql-indent-1 {
	counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
ol li.ql-indent-2 {
	counter-increment: list-2;
}
ol li.ql-indent-2::before {
	content: counter(list-2, lower-roman) '. ';
}
ol li.ql-indent-2 {
	counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
ol li.ql-indent-3 {
	counter-increment: list-3;
}
ol li.ql-indent-3::before {
	content: counter(list-3, decimal) '. ';
}
ol li.ql-indent-3 {
	counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;
}
ol li.ql-indent-4 {
	counter-increment: list-4;
}
ol li.ql-indent-4::before {
	content: counter(list-4, lower-alpha) '. ';
}
ol li.ql-indent-4 {
	counter-reset: list-5 list-6 list-7 list-8 list-9;
}
ol li.ql-indent-5 {
	counter-increment: list-5;
}
ol li.ql-indent-5::before {
	content: counter(list-5, lower-roman) '. ';
}
ol li.ql-indent-5 {
	counter-reset: list-6 list-7 list-8 list-9;
}
ol li.ql-indent-6 {
	counter-increment: list-6;
}
ol li.ql-indent-6::before {
	content: counter(list-6, decimal) '. ';
}
ol li.ql-indent-6 {
	counter-reset: list-7 list-8 list-9;
}
ol li.ql-indent-7 {
	counter-increment: list-7;
}
ol li.ql-indent-7::before {
	content: counter(list-7, lower-alpha) '. ';
}
ol li.ql-indent-7 {
	counter-reset: list-8 list-9;
}
ol li.ql-indent-8 {
	counter-increment: list-8;
}
ol li.ql-indent-8::before {
	content: counter(list-8, lower-roman) '. ';
}
ol li.ql-indent-8 {
	counter-reset: list-9;
}
ol li.ql-indent-9 {
	counter-increment: list-9;
}
ol li.ql-indent-9::before {
	content: counter(list-9, decimal) '. ';
}
.ql-indent-1 {
	padding-left: 2em;
}
li.ql-indent-1 {
	padding-left: 2em;
	list-style-position: inside;
}
.ql-indent-2 {
	padding-left: 4em;
}
li.ql-indent-2 {
	padding-left: 4em;
	list-style-position: inside;
}
.ql-indent-3 {
	padding-left: 6em;
}
li.ql-indent-3 {
	padding-left: 6em;
	list-style-position: inside;
}
.ql-indent-4 {
	padding-left: 8em;
}
li.ql-indent-4 {
	padding-left: 8em;
	list-style-position: inside;
}
.ql-indent-5 {
	padding-left: 10em;
}
li.ql-indent-5 {
	padding-left: 10em;
	list-style-position: inside;
}
.ql-indent-6 {
	padding-left: 12em;
}
li.ql-indent-6 {
	padding-left: 12em;
	list-style-position: inside;
}
.ql-indent-7 {
	padding-left: 14em;
}
li.ql-indent-7 {
	padding-left: 14em;
	list-style-position: inside;
}
.ql-indent-8 {
	padding-left: 16em;
}
li.ql-indent-8 {
	padding-left: 16em;
	list-style-position: inside;
}
.ql-indent-9 {
	padding-left: 18em;
}
li.ql-indent-9 {
	padding-left: 18em;
	list-style-position: inside;
}
</style>
