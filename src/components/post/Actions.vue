<template>
	<section>
		<!-- Post a Comment -->
		<article class="py-5">
			<div class="flex items-start">
				<!-- Comment box Container -->
				<div
					class="comment-container relative flex shadow-xl rounded-xl w-full overflow-hidden p-4"
					:class="`bg-` + emotionCategory"
				>
					<!-- Previous page Arrow -->
					<button
						v-show="showEmotions && page > 0"
						class="absolute focus:outline-none left-0 mt-20 z-10 rounded-full border bg-white p-2"
						@click="page -= 1"
					>
						<ChevronLeft />
					</button>
					<div
						class="flip-container relative border shadow-inner rounded-xl overflow-hidden w-full h-40"
						:class="showEmotions ? 'flip' : ''"
					>
						<div class="flipper flex flex-row absolute">
							<!-- Front side: Type comment -->
							<div class="front w-full flex bg-white">
								<button class="h-auto flex-shrink-0 focus:outline-none" @click="showEmotions = !showEmotions">
									<span v-if="emotion !== ''">
										<img
											:src="reactionList[emotion].imageRight"
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
							<div class="back w-full h-40 bg-white">
								<!-- Text and filter -->
								<div class="flex justify-between w-full px-4">
									<h6>Define your comments emotion</h6>
									<!-- Sort by filter -->
									<div class="flex">
										<h6 class="mr-2">Sort by</h6>
										<button v-show="!showDropdown" class="font-semibold" @click="showDropdown = !showDropdown">
											{{ emotionCategory }}
										</button>
										<div v-show="showDropdown">
											<button class="focus:outline-none mr-2 font-semibold" @click="setEmotionCategory(`default`)">
												All
											</button>
											<button
												class="focus:outline-none mr-2 text-positive font-semibold"
												@click="setEmotionCategory(`positive`)"
											>
												Positive
											</button>
											<button
												class="focus:outline-none mr-2 text-negative font-semibold"
												@click="setEmotionCategory(`negative`)"
											>
												Negative
											</button>
											<button
												class="focus:outline-none mr-2 text-neutral font-semibold"
												@click="setEmotionCategory(`neutral`)"
											>
												Neutral
											</button>
										</div>
									</div>
								</div>
								<!-- Grid of faces -->
								<div class="faces flex flex-row justify-around flex-wrap w-full bg-white py-2">
									<div v-for="e in getFaces()" :key="e">
										<button
											v-if="e"
											:class="`border-` + reactionList[e].filter"
											class="
												border
												items-center
												rounded-xl
												shadow-lg
												transition
												duration-500
												ease-in-out
												transform
												hover:scale-105
												focus:outline-none
												w-24
												h-24
												my-5
											"
											@click="setEmotion(e, reactionList[e].filter)"
										>
											<img
												:src="reactionList[e].imageLeft"
												:alt="reactionList[e].label"
												class="flex-shrink-0 h-24 w-24"
											/>
											<span class="text-xs text-center text-black w-24 -mt-1">{{ reactionList[e].label }}</span>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<!-- Next page Arrow -->
					<button
						v-show="showEmotions"
						class="absolute focus:outline-none right-0 mt-20 rounded-full border bg-white p-2"
						@click="page += 1"
					>
						<ChevronRight />
					</button>
				</div>
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
import ChevronRight from '@/components/icons/ChevronRight.vue'
import ChevronLeft from '@/components/icons/ChevronLeft.vue'

import { backgrounds, reactions, feelings } from '@/config'
import { createComment, sendComment, ICommentData, getCommentsOfPost } from '@/backend/comment'

interface IData {
	backgroundList: Record<string, string>
	reactionList: Record<string, any>
	feelingList: Record<string, any>
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
		ChevronRight,
		ChevronLeft,
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
			feelingList: feelings,
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
		setEmotion(r: string, c: string) {
			this.emotion = r
			this.page = 0
			this.showEmotions = false
			this.emotionCategory = c
		},
		setEmotionCategory(c: string) {
			this.showDropdown = false
			this.page = 0
			this.emotionCategory = c
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
/* entire container, keeps perspective */
.flip-container {
	perspective: 1000px;
}
.flip-container.flip .flipper {
	transform: rotateY(180deg);
}

/* flip speed goes here */
.flipper {
	transition: 0.6s;
	transform-style: preserve-3d;
	position: relative;
}

/* hide back of pane during swap */
.front,
.back {
	backface-visibility: hidden;
	position: absolute;
	top: 0;
	left: 0;
}

/* front pane, placed above back */
.front {
	z-index: 2;
	/* for firefox 31 */
	transform: rotateY(0deg);
}

/* back, initially hidden pane */
.back {
	transform: rotateY(180deg);
}
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
