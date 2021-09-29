<template>
	<section>
		<article v-for="comment in comments" :key="comment.cid">
			<CommentCard :comment="comment" :profile="profile" />
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { Profile } from '@/backend/profile'
import CommentCard from '@/components/post/CommentCard.vue'
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
		CommentCard,
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
		window.addEventListener(`scroll`, this.handleScroll)
		// Fetch comments from Orbit DB by ID
		this.comments = await getCommentsOfUser(this.$props.profile.id, this.currentOffset, this.limit)
		this.currentOffset += this.limit
		this.isLoading = false
	},
	destroyed() {
		window.removeEventListener(`scroll`, this.handleScroll)
	},
	methods: {
		async loadComments() {
			this.isLoading = true
			try {
				const res = await getCommentsOfUser(this.$props.profile.id, this.currentOffset, this.limit)
				if (res.length === 0) {
					this.isLoading = false
					window.removeEventListener(`scroll`, this.handleScroll)
				}
				this.comments = this.comments.concat(res)
			} catch (err) {
				alert(err)
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
	},
})
</script>
