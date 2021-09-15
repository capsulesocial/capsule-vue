<template>
	<section>
		<!-- Post a Comment -->
		<article class="py-5">
			<div class="flex items-start">
				<!-- Comment box Container -->
				<div
					class="comment-container flex bg-white shadow-xl rounded-xl w-full overflow-hidden"
					style="padding: 8px 10px 8px 10px"
					:style="{ backgroundImage: `url(${backgroundList[emotionCategory]})` }"
				>
					<div
						class="flip-container relative border shadow-inner rounded-xl overflow-hidden w-full h-40"
						:class="showEmotions ? 'flip' : ''"
					>
						<div class="flipper flex flex-row absolute">
							<!-- Front side: Type comment -->
							<div class="front w-full flex bg-white">
								<button
									class="h-auto flex-shrink-0 focus:outline-none"
									style="margin-left: 15.2px; margin-bottom: 15px; margin-top: 15px; width: 126px; height: 126px"
									@click="showEmotions = !showEmotions"
								>
									<span v-if="emotion !== ''">
										<img
											:src="reactionList[emotion].image"
											class="object-contain"
											style="width: 126px; height: 126px"
										/>
									</span>
									<span v-else><FlipIcon style="width: 126px; height: 126px" /></span>
								</button>
								<textarea
									v-model="comment"
									class="
										leading-normal
										resize-none
										overflow-y-auto
										w-full
										h-40
										pl-2
										py-16
										pr-16
										mr-4
										focus:outline-none
									"
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
							<div class="back flex w-full h-40">
								<!-- Left side: Category of emotion -->
								<div class="w-40 flex flex-col bg-white items-center">
									<button
										class="focus:outline-none rounded-lg w-24 py-1 mt-4"
										:style="{ backgroundImage: `url(${backgroundList.positive})` }"
										@click="setEmotionCategory(`positive`)"
									>
										Positive
									</button>
									<button
										class="focus:outline-none rounded-lg w-24 py-1 mt-4"
										:style="{ backgroundImage: `url(${backgroundList.negative})` }"
										@click="setEmotionCategory(`negative`)"
									>
										Negative
									</button>
									<button
										class="focus:outline-none rounded-lg w-24 py-1 mt-4"
										:style="{ backgroundImage: `url(${backgroundList.neutral})` }"
										@click="setEmotionCategory(`neutral`)"
									>
										Neutral
									</button>
								</div>
								<!-- Right side: images -->
								<div class="faces overflow-y-scroll flex flex-row justify-around flex-wrap w-full bg-white">
									<button
										v-for="e in feelingList[emotionCategory]"
										:key="e"
										class="
											items-center
											rounded-lg
											shadow-lg
											transition
											duration-500
											ease-in-out
											transform
											hover:scale-105
											focus:outline-none
											w-24
											h-24
											m-1
										"
										@click="setEmotion(e)"
									>
										<img :src="reactionList[e].image" :alt="reactionList[e].label" class="flex-shrink-0 h-24 w-24" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</article>
		<article class="w-full flex justify-between">
			<div>{{ comments.length }} comments</div>
			<CommentFilter :filter="filter" @clicked="setFilter" />
		</article>
		<article v-for="c in comments" :key="c.cid" class="py-2">
			<CommentCard :authorID="c.authorID" :cid="c.cid" :timestamp="c.timestamp" />
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import BrandedButton from '@/components/BrandedButton.vue'
import CommentCard from '@/components/post/Comment.vue'
import CommentFilter from '@/components/post/CommentFilter.vue'
import FlipIcon from '@/components/icons/Flip.vue'
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
}

export default Vue.extend({
	name: `ComponentPostActions`,
	components: {
		BrandedButton,
		CommentCard,
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
			feelingList: feelings,
			comment: ``,
			comments: [],
			emotion: ``,
			emotionCategory: `default`,
			showEmotions: false,
			commentBackground: `@/assets/images/brand/paper4.svg`,
			filter: ``,
		}
	},
	async created() {
		if (!this.initComments) {
			this.comments = await getCommentsOfPost(this.postCID)
		} else {
			this.comments = this.initComments
		}
	},
	methods: {
		setFilter(reaction: string): void {
			this.filter = reaction
			this.filterComments()
		},
		setEmotion(r: string) {
			this.emotion = r
			this.showEmotions = false
		},
		setEmotionCategory(c: string) {
			this.emotionCategory = c
		},
		async sendComment() {
			if (!this.$qualityText(this.comment)) {
				alert(`invalid comment!`)
			} else {
				const c = createComment(this.$store.state.session.id, this.comment, this.emotion, this.postCID)
				const cid = await sendComment(c, `comment`)
				// Send comment (c)
				this.comments.push({ cid, ...c })
				// Apply filter to comments, in case new comment was added in filtered category
				this.filterComments()
				this.comment = ``
				this.emotion = ``
				this.filter = ``
				this.emotionCategory = `default`
			}
		},
		async filterComments() {
			// Fetch comments
			if (this.filter === ``) {
				const cList: ICommentData[] = await getCommentsOfPost(this.postCID)
				this.comments = cList.reverse()
			} else {
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
.comment-container {
	background: no-repeat;
	-webkit-background-size: cover;
	-moz-background-size: cover;
	-o-background-size: cover;
	background-size: cover;
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
