<template>
	<section class="border-lightBorder w-full border">
		<!-- Header -->
		<div
			id="header"
			class="bg-darkBG dark:bg-lightBG border-lightBorder animatefast flex h-56 w-full flex-row items-center rounded-lg shadow-lg"
			:style="{
				background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%), url(${require(`@/assets/images/category/` +
					$route.params.category +
					`/` +
					`header.webp`)})`,
				backgroundSize: 'cover',
			}"
		>
			<div class="flex h-full flex-col justify-between px-4 py-5 xl:px-6">
				<button class="focus:outline-none relative flex" @click="handleBack">
					<div class="bg-gray1 z-10 flex-shrink-0 rounded-full">
						<BackIcon />
					</div>
					<p id="buttontitle" class="animatefast pl-3 pr-4 font-semibold">All categories</p>
					<h2
						id="hiddentitle"
						class="text-lightPrimaryText dark:text-darkPrimaryText animatelong absolute ml-8 -mt-1 px-2 text-xl font-semibold capitalize opacity-0"
					>
						{{ $route.params.category.replace(`-`, ` `) }}
					</h2>
					<div
						id="buttonbg"
						class="bg-lightBG animatefast absolute h-full rounded-full bg-opacity-50"
						style="backdrop-filter: blur(10px); width: 155px; z-index: 0"
					></div>
				</button>
				<h2
					id="title"
					class="text-lightOnPrimaryText animatefast font-semibold capitalize"
					style="font-size: 1.875rem; line-height: 38px"
				>
					{{ $route.params.category.replace(`-`, ` `) }}
				</h2>
			</div>
		</div>
		<!-- Posts loaded -->
		<div
			id="column"
			class="w-full overflow-y-auto"
			:style="
				!scrollDown
					? `min-height: calc(100vh - ` + `310px` + `); height: calc(100vh - ` + `310px` + `)`
					: `min-height: calc(100vh - ` + `152px` + `); height: calc(100vh - ` + `152px` + `)`
			"
		>
			<article
				v-if="posts.length == 0 && !isLoading"
				class="mt-10 grid justify-items-center overflow-y-hidden px-6 xl:px-0"
			>
				<p class="text-gray5 dark:text-gray3 align-end mb-5 flex items-end text-sm" style="max-width: 366px">
					It seems there are no posts under this category yet
				</p>
				<SecondaryButton :text="`All categories`" :action="toggleCategories" />
				<img :src="require(`@/assets/images/brand/post.webp`)" class="top-0 mt-64 xl:-mt-2" />
			</article>
			<article v-for="p in posts" :key="generateKey(p)">
				<PostCard
					:repost="p.repost"
					:post="p.post"
					:cid="p.post._id"
					:commentsCount="p.commentsCount"
					:toggleFriend="toggleFriend"
					:usersFollowing="following"
					:repostedBy="p.repost ? p.repost.authorID : undefined"
					:bookmarked="p.bookmarked"
					:hideRepostIcon="algorithm === `NEW` || algorithm === `TOP`"
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
		</div>
		<!-- Not loaded yet -->
		<article v-show="isLoading" class="modal-animation flex w-full justify-center mt-20">
			<div
				class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
				:style="`border-top: 2px solid` + $color.hex"
			></div>
		</article>
	</section>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import PostCard from '@/components/post/Card.vue'
import BackIcon from '@/components/icons/ChevronLeft.vue'
import { getPosts, Algorithm, IPostResponse, IRepostResponse, IGenericPostResponse } from '@/backend/post'

interface IData {
	posts: Array<IGenericPostResponse>
	isLoading: boolean
	lastScroll: number
	currentOffset: number
	limit: number
	algorithm: Algorithm
	padding: number
	scrollDown: boolean
	noMorePosts: boolean
	fromExternalSite: boolean
}

export default Vue.extend({
	components: {
		PostCard,
		BackIcon,
	},
	beforeRouteEnter(to, from, next) {
		next((vm: any) => {
			if (to && from.name === null) {
				vm.fromExternalSite = true
			}
		})
		return true
	},
	layout: `discover`,
	props: {
		toggleFriend: {
			type: Function as PropType<() => void>,
			required: true,
		},
		following: {
			type: Set as PropType<Set<string>>,
			default: () => new Set(),
		},
	},
	data(): IData {
		return {
			posts: [],
			isLoading: true,
			currentOffset: 0,
			limit: 10,
			algorithm: `NEW`,
			lastScroll: 0,
			padding: 224,
			scrollDown: false,
			noMorePosts: false,
			fromExternalSite: false,
		}
	},
	head() {
		return {
			title: `${this.$route.params.category} category on Blogchain`,
			meta: [
				{
					hid: `${this.$route.params.category}`,
					name: `${this.$route.params.category}`,
					content: `${this.$route.params.category} category on Blogchain`,
				},
			],
		}
	},
	async created() {
		this.posts = await this.fetchPosts()
	},
	mounted() {
		const container = document.getElementById(`column`)
		if (container) {
			container.addEventListener(`scroll`, this.handleScrollHeader, true)
		}
	},
	methods: {
		async fetchPosts(): Promise<IGenericPostResponse[]> {
			this.isLoading = true
			const id = this.$store.state.session.id === `` ? `x` : this.$store.state.session.id
			const posts = await getPosts({ category: this.$route.params.category }, id, {
				sort: this.algorithm,
				limit: this.limit,
				offset: this.currentOffset,
			})
			this.currentOffset += this.limit
			this.isLoading = false
			// No more posts
			if (posts.length < this.limit) {
				if (posts.length > 0) {
					this.noMorePosts = true
				}
				const container = document.getElementById(`column`)
				if (container) {
					container.removeEventListener(`scroll`, this.handleScrollHeader)
				}
			}
			return this.posts.concat(posts)
		},
		async handleScrollHeader() {
			const body = document.getElementById(`column`)
			const header = document.getElementById(`header`)
			const buttontitle = document.getElementById(`buttontitle`)
			const buttonbg = document.getElementById(`buttonbg`)
			const title = document.getElementById(`title`)
			const hiddentitle = document.getElementById(`hiddentitle`)
			const scrollUp = `scrollup`
			const scrollDown = `scrolldown`
			const opacity0 = `opacity0`
			const opacity1 = `opacity1`
			if (!body) {
				return
			}
			if (!buttontitle) {
				return
			}
			if (!buttonbg) {
				return
			}
			if (!title) {
				return
			}
			if (!hiddentitle) {
				return
			}
			if (!header) {
				return
			}
			this.padding = header?.clientHeight
			const currentScroll = body.scrollTop
			// Reached bottom, fetch more posts
			if (body.scrollTop + body.clientHeight === body.scrollHeight && !this.noMorePosts) {
				if (this.isLoading) {
					return
				}
				this.posts = await this.fetchPosts()
			}
			// Reached bottom, prevent mobile glitching
			if (body.scrollTop + body.clientHeight + 60 >= body.scrollHeight) {
				return
			}
			if (body.scrollTop <= 0 && this.scrollDown === false) {
				header.classList.remove(scrollUp)
				buttontitle.classList.remove(opacity0)
				buttonbg.classList.remove(opacity0)
				title.classList.remove(opacity0)
				hiddentitle.classList.remove(opacity1)
				return
			}
			if (currentScroll > this.lastScroll && !header.classList.contains(scrollDown)) {
				// down
				this.scrollDown = true
				header.classList.remove(scrollUp)
				buttontitle.classList.remove(opacity1)
				buttonbg.classList.remove(opacity1)
				title.classList.remove(opacity1)
				hiddentitle.classList.remove(opacity0)
				header.classList.add(scrollDown)
				buttontitle.classList.add(opacity0)
				buttonbg.classList.add(opacity0)
				title.classList.add(opacity0)
				hiddentitle.classList.add(opacity1)
			} else if (
				currentScroll < this.lastScroll &&
				header.classList.contains(scrollDown) &&
				body.scrollTop + body.clientHeight !== body.scrollHeight
			) {
				// up
				this.scrollDown = false
				header.classList.remove(scrollDown)
				buttontitle.classList.remove(opacity0)
				buttonbg.classList.remove(opacity0)
				title.classList.remove(opacity0)
				hiddentitle.classList.remove(opacity1)
				header.classList.add(scrollUp)
				buttontitle.classList.add(opacity1)
				title.classList.add(opacity1)
				hiddentitle.classList.add(opacity0)
			}
			this.lastScroll = currentScroll
		},
		generateKey(p: IPostResponse | IRepostResponse) {
			let key: string = p.post._id
			if (`repost` in p) {
				key += p.repost._id
			}
			return key
		},
		toggleCategories() {
			this.$router.push(`/discover`)
		},
		handleBack() {
			if (this.fromExternalSite) {
				this.$router.push({ name: `home` })
				return
			}
			this.$router.go(-1)
		},
	},
})
</script>

<style>
.animatefast {
	transition: all 0.4s;
	z-index: 50;
}
.animatelong {
	transition: all 0.6s;
	z-index: 50;
}
.scrolldown {
	background: linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.25) 100%), none !important;
	height: 4rem;
	backdrop-filter: blur(10px);
}
.scrollup {
	opacity: 1;
	transform: none;
}
.opacity0 {
	opacity: 0;
}
.opacity1 {
	opacity: 1;
}
</style>
