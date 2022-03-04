<template>
	<section class="px-5 xl:px-6">
		<article v-if="comments.length == 0 && !isLoading" class="mt-24 grid justify-items-center px-10 xl:px-0">
			<p class="text-gray5 dark:text-gray3 mb-5 text-sm">
				<span v-if="$route.params.id === $store.state.session.id">
					It seems you haven't written any comments yet, you can comment on any post:
				</span>
				<span v-else> {{ $route.params.id }} hasn't written any comments yet </span>
			</p>
			<SecondaryButton
				v-if="$store.state.session.id === $route.params.id"
				:text="`Comment a post`"
				:action="toggleHomeFeed"
			/>
			<img :src="require(`@/assets/images/brand/post.webp`)" class="top-0 mt-52 xl:-mt-2" />
		</article>
		<article v-for="comment in comments" :key="comment._id">
			<div class="pb-5">
				<Comment
					:authorID="profile.id"
					:cid="comment._id"
					:timestamp="comment.timestamp"
					:parentCID="comment.parentCID"
				/>
			</div>
		</article>
		<article v-show="isLoading" class="modal-animation flex justify-center">
			<div class="loader m-10"></div>
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { Profile } from '@/backend/profile'
import Comment from '@/components/post/Comment.vue'

import { getCommentsOfUser, ICommentData } from '@/backend/comment'

interface IData {
	comments: ICommentData[]
	isLoading: boolean
	currentOffset: number
	limit: number
}

export default Vue.extend({
	name: `IDCommentsPage`,
	components: {
		Comment,
	},
	props: {
		profile: {
			type: Object as PropType<Profile>,
			required: true,
		},
	},
	data(): IData {
		return {
			comments: [],
			isLoading: true,
			currentOffset: 0,
			limit: 10,
		}
	},
	async created() {
		// Fetch comments from Orbit DB by ID
		this.comments = await getCommentsOfUser(this.profile.id, this.currentOffset, this.limit)
		this.currentOffset += this.limit
		this.isLoading = false
		window.addEventListener(`scroll`, this.handleScroll)
	},
	destroyed() {
		window.removeEventListener(`scroll`, this.handleScroll)
	},
	methods: {
		async loadComments() {
			this.isLoading = true
			try {
				const res = await getCommentsOfUser(this.profile.id, this.currentOffset, this.limit)
				if (res.length === 0) {
					this.isLoading = false
					window.removeEventListener(`scroll`, this.handleScroll)
				}
				this.comments = this.comments.concat(res)
			} catch (err: any) {
				if (err.response) {
					this.$toastError(err.response.data.error)
					return
				}
				this.$toastError(err.message)
			} finally {
				this.isLoading = false
			}
		},
		async handleScroll() {
			const { scrollTop, scrollHeight, clientHeight } = document.documentElement
			if (scrollTop + clientHeight >= scrollHeight - 5) {
				await this.loadComments()
				this.currentOffset += this.limit
			}
		},
		toggleHomeFeed() {
			this.$router.push(`/home`)
		},
	},
})
</script>
