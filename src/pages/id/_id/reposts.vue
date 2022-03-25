<template>
	<section class="px-0">
		<article v-if="reposts.length === 0 && !isLoading" class="mt-24 grid justify-items-center px-10 xl:px-0">
			<p class="text-gray5 dark:text-gray3 mb-5 text-sm">
				<span v-if="$route.params.id === $store.state.session.id"
					>It seems you haven't reposted any content yet, you can repost any post:</span
				>
				<span v-else>{{ $route.params.id }} hasn't reposted any content yet</span>
			</p>
			<SecondaryButton
				v-if="$store.state.session.id === $route.params.id"
				:text="`Repost content`"
				:action="toggleHomeFeed"
			/>
			<img :src="require(`@/assets/images/brand/post.webp`)" class="top-0 mt-52 xl:-mt-2" />
		</article>
		<article v-for="p in reposts" :key="p.repost._id">
			<PostCard
				:repost="p.repost"
				:post="p.post"
				:cid="p.post._id"
				:comments="p.comments"
				:toggleFriend="toggleFriend"
				:usersFollowing="following"
				:repostedBy="p.repost.authorID"
				:bookmarked="p.bookmarked"
				:bookmarksCount="p.bookmarksCount"
				:repostCount="p.repostCount"
				:isDeleted="p.deleted"
			/>
		</article>
		<p
			v-if="noMorePosts && reposts.length !== 0"
			class="text-gray5 dark:text-gray3 py-5 text-center text-sm"
			style="backdrop-filter: blur(10px)"
		>
			No more posts
		</p>
		<article v-show="isLoading" class="flex justify-center">
			<div
				class="loader m-10 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
				:style="dark ? `border-top: 2px solid #7097ac` : `border-top: 2px solid #2e556a`"
			></div>
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import PostCard from '@/components/post/Card.vue'
import { getReposts } from '@/backend/reposts'
import { Profile } from '@/backend/profile'
import { followChange, getFollowersAndFollowing } from '@/backend/following'
import { IRepostResponse, Algorithm } from '@/backend/post'

interface IData {
	reposts: Array<IRepostResponse>
	isLoading: boolean
	currentOffset: number
	limit: number
	following: Set<string>
	algorithm: Algorithm
	noMorePosts: boolean
	dark: boolean
}

export default Vue.extend({
	components: {
		PostCard,
	},
	props: {
		profile: {
			type: Object as PropType<Profile>,
			default: null,
		},
	},
	data(): IData {
		return {
			reposts: [],
			isLoading: true,
			currentOffset: 0,
			limit: 10,
			following: new Set(),
			algorithm: `NEW`,
			noMorePosts: false,
			dark: false,
		}
	},
	async created() {
		await this.loadReposts()
		if (this.$store.state.session.id === ``) {
			return
		}
		if (document.documentElement.classList.contains(`dark`)) {
			this.dark = true
		} else {
			this.dark = false
		}
		this.updateFollowers()
	},
	mounted() {
		const container = this.$parent.$refs.scrollContainer as HTMLElement
		container.addEventListener(`scroll`, this.handleScroll)
	},
	methods: {
		async updateFollowers() {
			const followersAndFollowing = await getFollowersAndFollowing(this.$store.state.session.id, true)
			this.following = followersAndFollowing.following
		},
		async loadReposts() {
			this.isLoading = true
			try {
				const res = await getReposts(
					{ authorID: this.$route.params.id },
					{ sort: this.algorithm, offset: this.currentOffset, limit: this.limit },
				)
				// When no more posts
				if (res.length < this.limit) {
					this.noMorePosts = true
					const container = this.$parent.$refs.scrollContainer as HTMLElement
					container.removeEventListener(`scroll`, this.handleScroll)
				}
				this.reposts = this.reposts.concat(res)
				this.currentOffset += this.limit
				this.isLoading = false
			} catch (error) {
				// TODO: handle error
			} finally {
				this.isLoading = false
			}
		},
		async handleScroll(e: Event) {
			if (!this.isLoading) {
				const { scrollTop, scrollHeight, clientHeight } = e.srcElement as HTMLElement
				// Fetch reposts when reaching the bottom of page
				if (scrollTop + clientHeight >= scrollHeight - 5) {
					await this.loadReposts()
				}
			}
		},
		async toggleFriend(authorID: string) {
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			try {
				if (authorID !== this.$store.state.session.id) {
					await followChange(
						this.following.has(authorID) ? `UNFOLLOW` : `FOLLOW`,
						this.$store.state.session.id,
						authorID,
					)
					this.$toastSuccess(this.following.has(authorID) ? `Unfollowed ${authorID}` : `Followed ${authorID}`)
					this.updateFollowers()
				}
			} catch (err: unknown) {
				this.$handleError(err)
			}
		},
		toggleHomeFeed() {
			this.$router.push(`/home`)
		},
	},
})
</script>
