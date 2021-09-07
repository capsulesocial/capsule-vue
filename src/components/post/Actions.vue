<template>
	<section>
		<!-- Post a Comment -->
		<article class="py-5">
			<div class="flex items-start">
				<!-- Comment box Container -->
				<div
					class="comment-container flex bg-white shadow-xl rounded-xl w-full overflow-hidden"
					style="padding: 16px 20px 16px 20px"
					:style="{ backgroundImage: `url(${this.backgroundList[this.emotionCategory]})` }"
				>
					<div
						class="flip-container relative border shadow-inner rounded-xl overflow-hidden w-full h-40"
						:class="this.showEmotions ? 'flip' : ''"
					>
						<div class="flipper flex flex-row absolute">
							<!-- Front side: Type comment -->
							<div class="front w-full flex bg-white">
								<div class="self-center">
									<button style="margin-left: 40px" @click="showEmotions = !showEmotions">
										<img v-if="this.emotion !== ''" :src="this.emotion.image" class="max-w-full h-auto object-center" />
										<span v-else><FlipIcon class="w-12 h-12" /></span>
									</button>
								</div>
								<textarea
									v-model="comment"
									class="leading-normal resize-none overflow-y-auto w-full h-40 pl-2 py-8 pr-16 mr-4 focus:outline-none"
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
											:class="this.comment !== '' ? '' : 'opacity-50'"
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
								<div class="overflow-auto grid grid-cols-3 w-full -mr-1 bg-white">
									<button
										v-for="e in this.feelingList[this.emotionCategory]"
										:key="e"
										class="w-full items-center focus:outline-none"
										@click="setEmotion(reactionList[e])"
									>
										<img :src="reactionList[e].image" :alt="reactionList[e].label" class="flex-shrink-0 h-20 w-20" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</article>
		<article class="w-full flex justify-between">
			<div>{{ this.comments.length }} comments</div>
			<CommentFilter :filter="this.filter" @clicked="setFilter" />
		</article>
		<article v-for="c in this.comments" :key="c.cid" class="py-2">
			<CommentCard :authorID="c.authorID" :cid="c.cid" :timestamp="c.timestamp" />
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import BrandedButton from '@/components/BrandedButton.vue'
import CommentCard from '@/components/post/Comment.vue'
import CommentFilter from '@/components/post/CommentFilter.vue'
import FlipIcon from '@/components/icons/Flip.vue'
import { backgrounds, reactions, feelings } from '@/config'

interface INewCommentData {
	content: string
	emotion: string
	timestamp: number
	postCID: string
	authorID: string
}

interface ICommentData {
	authorID: string
	cid: string
	timestamp: number
	emotion: string
}

interface IData {
	backgroundList: {}
	reactionList: {}
	feelingList: {}
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
			type: String as () => string,
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
		const res = await this.$axios.$get(`/content/${this.postCID}/comments`)
		this.comments = res.data.comments
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
				const c: INewCommentData = {
					authorID: this.$store.state.session.id,
					content: this.comment,
					emotion: this.emotion,
					timestamp: Date.now(),
					postCID: this.postCID,
				}

				const cid = await this.$sendComment(c)
				await this.$axios.$post(`/content/${this.postCID}/comments`, { cid, data: c, sig: `whatever`, type: `comment` })

				// Send comment (c)
				this.comments.push({ cid, timestamp: c.timestamp, authorID: c.authorID, emotion: c.emotion })
				// Apply filter to comments, in case new comment was added in filtered category
				this.filterComments()
				this.comment = ``
				this.emotion = ``
				this.filter = ``
				this.emotionCategory = `default`
			}
		},
		filterComments() {
			// Fetch comments
			let cList: ICommentData[] = this.comments
			// Filter by emotion
			if (this.filter !== ``) {
				cList = cList.filter((c) => c.emotion === this.filter)
			}
			// Show most recent first
			cList = cList.slice().sort((p0, p1) => p1.timestamp - p0.timestamp)
			// Set obect to filtered comments
			this.comments = cList
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
</style>
