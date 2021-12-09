<template>
	<section>
		<!-- Post a Comment -->
		<article class="py-5">
			<!-- Bottom overlay with selector -->
			<div v-show="showEmotions" class="w-full flex flex-row-reverse">
				<div class="h-24 -mb-24 z-10 bg-white" style="width: 450px">
					<h6 class="text-primary text-2xl text-center self-center">How do you feel?</h6>
				</div>
			</div>
			<div class="flex items-start">
				<!-- Comment box Container -->
				<div
					class="flex shadow-xl rounded-xl w-full overflow-hidden"
					:class="showEmotions ? `` : `border p-4 bg-` + emotionCategory"
				>
					<div class="rounded-xl overflow-hidden w-full" :class="showEmotions ? 'h-64' : 'h-40'">
						<div class="flex flex-row">
							<!-- Front side: Type comment -->
							<div v-show="!showEmotions" class="w-full flex bg-white">
								<button class="h-auto flex-shrink-0 focus:outline-none" @click="showEmotions = !showEmotions">
									<span v-if="activeEmotion.label !== ''">
										<img
											:src="activeEmotion.rightImage"
											:alt="activeEmotion.label"
											class="object-contain"
											style="width: 126px; height: 126px"
										/>
									</span>
									<span v-else><FlipIcon style="width: 80px; height: 80px" /></span>
								</button>
								<textarea
									v-model="comment"
									class="leading-normal resize-none overflow-y-auto w-full h-40 pl-2 py-4 pr-16 mr-6 focus:outline-none"
									name="body"
									placeholder="What's your response?"
								/>
								<div class="relative">
									<span class="absolute bottom-0 right-0 flex flex-col">
										<BrandedButton
											style="margin-right: 15.2px; margin-bottom: 15px"
											text="Post"
											:action="sendComment"
											:thin="true"
											:class="comment !== '' ? '' : 'opacity-50'"
										/>
									</span>
								</div>
							</div>
							<!-- Back side: Choose reaction -->
							<div v-show="showEmotions" class="w-full h-64 overflow-y-auto bg-white">
								<div
									v-for="row in faceGroupings"
									:key="row[0].label + row[1].label + row[2].label"
									class="flex flex-row w-full"
								>
									<button v-for="face in row" :key="face.label" @click="setEmotion(face)">
										<img :src="face.leftImage" :alt="face.label" class="w-24 h-24" />
									</button>
									<p
										v-for="face in row"
										:key="face.label + face.label"
										class="flex flex-grow justify-center items-center"
									>
										{{ face.label }} <span class="px-2">*</span>
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- Bottom overlay with selector -->
			<div v-show="showEmotions" class="w-full flex flex-row-reverse">
				<div class="h-24 -mt-24 z-10 bg-white" style="width: 450px"></div>
			</div>
		</article>
		<article class="w-full flex justify-between">
			<div>{{ comments.length }} comments</div>
			<CommentFilter :filter="filter" @clicked="setFilter" />
		</article>
		<article v-for="c in comments" :key="c._id" class="py-2">
			<Comment :authorID="c.authorID" :cid="c._id" :timestamp="c.timestamp" />
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import BrandedButton from '@/components/BrandedButton.vue'
import Comment from '@/components/post/Comment.vue'
import CommentFilter from '@/components/post/CommentFilter.vue'
import FlipIcon from '@/components/icons/Flip.vue'

import { backgrounds, reactions, feelings, faces, faceGroupings } from '@/config'
import { createComment, sendComment, ICommentData, getCommentsOfPost } from '@/backend/comment'

interface IData {
	backgroundList: Record<string, string>
	reactionList: Record<string, any>
	facesList: Record<string, any>
	faceGroupings: object[]
	feelingList: Record<string, any>
	activeEmotion: { label: string; leftImage: any; rightImage: any }
	comments: ICommentData[]
	comment: string
	emotion: string
	emotionCategory: string
	showEmotions: boolean
	commentBackground: string
	filter: string
	showDropdown: boolean
	page: number
}

export default Vue.extend({
	name: `ComponentPostActions`,
	components: {
		BrandedButton,
		Comment,
		CommentFilter,
		FlipIcon,
	},
	props: {
		postCID: {
			type: String as PropType<string>,
			required: true,
		},
		initComments: {
			type: Array as PropType<ICommentData[] | null>,
			default: null,
		},
	},
	data(): IData {
		return {
			backgroundList: backgrounds,
			reactionList: reactions,
			facesList: faces,
			faceGroupings,
			feelingList: feelings,
			activeEmotion: { label: ``, leftImage: null, rightImage: null },
			comment: ``,
			comments: [],
			emotion: ``,
			emotionCategory: `default`,
			showEmotions: false,
			commentBackground: `@/assets/images/brand/paper4.svg`,
			filter: ``,
			showDropdown: false,
			page: 0,
		}
	},
	async created() {
		if (!this.initComments) {
			this.comments = await getCommentsOfPost(this.postCID)
			this.comments = this.comments.reverse()
		} else {
			this.comments = this.initComments
			this.comments = this.comments.reverse()
		}
	},
	methods: {
		getFaces(): string[] {
			let list: string[] = []
			if (this.emotionCategory === `default`) {
				list.push(this.feelingList.positive[this.page])
				list.push(this.feelingList.neutral[this.page])
				list.push(this.feelingList.negative[this.page])
				list.push(this.feelingList.positive[this.page + 1])
				list.push(this.feelingList.neutral[this.page + 1])
				list.push(this.feelingList.negative[this.page + 1])
				return list
			}
			list = this.feelingList[this.emotionCategory].slice(this.page * 6, this.page * 6 + 6)
			return list
		},
		setFilter(reaction: string): void {
			this.filter = reaction
			this.filterComments()
		},
		setEmotion(r: { label: string; leftImage: any; rightImage: any }) {
			this.activeEmotion = r
			this.showEmotions = false
		},
		async sendComment() {
			if (this.emotion === ``) {
				this.$toastError(`Please select a reaction`)
				return
			}
			if (this.comment.length < 1 || this.comment.length > 5000) {
				this.$toastError(`Comment length too short or too long`)
				return
			}
			if (!this.$qualityText(this.comment)) {
				this.$toastError(`invalid comment!`)
			} else {
				const c = createComment(this.$store.state.session.id, this.comment, this.emotion, this.postCID)
				const _id = await sendComment(c, `comment`)
				// Send comment (c)
				this.comments.push({ _id, ...c })
				// Apply filter to comments, in case new comment was added in filtered category
				this.filterComments()
				this.comment = ``
				this.emotion = ``
				this.filter = ``
				this.emotionCategory = `default`
				this.filterComments()
			}
		},
		async filterComments() {
			// Fetch comments
			if (this.filter === ``) {
				const cList: ICommentData[] = await getCommentsOfPost(this.postCID)
				this.comments = cList.reverse()
			} else {
				if (this.filter === `positive` || this.filter === `neutral` || this.filter === `negative`) {
					const cList: ICommentData[] = await getCommentsOfPost(this.postCID, undefined, this.filter)
					this.comments = cList.reverse()
					return
				}
				const cList: ICommentData[] = await getCommentsOfPost(
					this.postCID,
					this.filter.charAt(0).toLowerCase() + this.filter.replace(/\s/g, ``).substring(1),
				)
				this.comments = cList.reverse()
			}
		},
	},
})
</script>

<style>
/* Custom scrollbar */
.faces::-webkit-scrollbar {
	width: 10px;
}
/* Track */
.faces::-webkit-scrollbar-track {
	box-shadow: inset 0 0 5px #888888;
	border-radius: 0.75rem;
}
/* Handle */
.faces::-webkit-scrollbar-thumb {
	background: #1e566c;
	border-radius: 0.75rem;
}

/* Handle on hover */
.faces::-webkit-scrollbar-thumb:hover {
	background: #1e566c;
}
</style>
