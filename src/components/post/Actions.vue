<template>
	<section>
		<article v-show="toggleStats" class="pt-5">
			<!-- Back button -->
			<div class="flex items-center">
				<button class="rounded-full bg-gray1 focus:outline-none" @click="toggleStats = false"><ChevronLeft /></button>
				<span class="pl-2 font-semibold">All comments</span>
			</div>
			<!-- Global Activity -->
			<div class="pt-5 border-b h-32 flex justify-between">
				<!-- Stats image -->
				<img :src="require(`@/assets/images/brand/stats.webp`)" class="h-full flex-shrink-0 pl-5" />
				<!-- Text stats -->
				<div class="flex flex-col w-1/2">
					<h6 class="text-sm pb-4">Global Post Activity</h6>
					<div class="flex flex-row">
						<!-- Bookmarks Count -->
						<div class="flex flex-col pr-4">
							<h2 class="text-2xl font-semibold">{{ bookmarksCount }}</h2>
							<span>Bookmarks</span>
						</div>
						<!-- Reposts count -->
						<div class="flex flex-col">
							<h2 class="text-2xl font-semibold">{{ repostsCount }}</h2>
							<span>Reposts</span>
						</div>
					</div>
				</div>
			</div>
			<!-- Comments Activity -->
			<div class="pt-5 border-b flex justify-between">
				<!-- Graph breakdown -->
				<div></div>
				<!-- Text stats -->
				<div class="flex flex-col w-1/2">
					<h6 class="text-sm pb-4">Comment Activity</h6>
					<!-- Bookmarks Count -->
					<div class="flex flex-row">
						<div class="flex flex-col pr-4">
							<h2 class="text-2xl font-semibold">{{ getCommentCount(`total`) }}</h2>
							<span>Total comments</span>
						</div>
					</div>
					<!-- Type breakdown Count -->
					<div class="flex flex-row">
						<div class="flex flex-col pr-4">
							<h2 class="text-2xl font-semibold text-lightPrimary">{{ getCommentCount(`positive`) }}</h2>
							<span>Positive</span>
						</div>
						<div class="flex flex-col pr-4">
							<h2 class="text-2xl font-semibold text-neutral">{{ getCommentCount(`neutral`) }}</h2>
							<span>Neutral</span>
						</div>
						<div class="flex flex-col pr-4">
							<h2 class="text-2xl font-semibold text-negative">{{ getCommentCount(`negative`) }}</h2>
							<span>Negative</span>
						</div>
					</div>
				</div>
			</div>
		</article>
		<!-- Post a Comment -->
		<article v-show="!toggleStats" class="pb-5">
			<div class="w-full flex justify-between py-5">
				<div class="flex flex-row items-center">
					<span class="pr-2 font-semibold">{{ getCommentCount(`total`) }} comments</span>
					<button class="focus:outline-none" @click="toggleStats = true"><StatsIcon /></button>
				</div>
				<CommentFilter :filter="filter" @clicked="setFilter" />
			</div>
			<!-- Bottom overlay with selector -->
			<div v-show="showEmotions" class="w-full flex flex-row-reverse">
				<div
					class="z-10 bg-white flex flex-row justify-between p-5"
					:style="$route.name === `post-post` ? `width: 450px` : `width: 406px`"
					style="margin-bottom: -112px"
				>
					<div></div>
					<h6 class="text-primary text-2xl text-center self-center">How do you feel?</h6>
					<div>
						<button class="p-2 bg-gray1 rounded-full focus:outline-none" @click="showEmotions = false">
							<CloseIcon />
						</button>
					</div>
				</div>
			</div>
			<div class="flex items-start">
				<!-- Comment box Container -->
				<div class="flex shadow-xl rounded-xl w-full overflow-hidden" :class="showEmotions ? `` : `border p-4`">
					<div class="rounded-xl overflow-hidden w-full" :style="showEmotions ? `height: 20rem` : `height: 10rem`">
						<div class="flex flex-row">
							<!-- Front side: Type comment -->
							<div v-show="!showEmotions" class="w-full flex bg-white">
								<button class="h-auto flex-shrink-0 focus:outline-none" @click="showEmotions = !showEmotions">
									<span v-if="activeEmotion.label !== ``">
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
							<div
								v-show="showEmotions"
								ref="scrollContainer"
								class="w-full overflow-y-scroll bg-white"
								style="
									height: 320px;
									box-shadow: rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset;
									scroll-snap-type: y mandatory;
									scroll-snap-stop: always;
								"
							>
								<!-- Middle selector area -->
								<div
									class="absolute rounded-lg bg-primary bg-opacity-25"
									style="height: 96px; margin-top: 112px"
									:style="$route.name === `post-post` ? `width: 760px` : `width: 699px`"
								></div>
								<!-- Faces grid -->
								<div style="padding-bottom: 112px; padding-top: 112px">
									<div
										v-for="row in faceGroupings"
										:key="row[0].label + row[1].label + row[2].label"
										class="flex flex-row w-full relative"
										style="scroll-snap-align: center"
									>
										<button
											v-for="face in row"
											:key="face.label"
											class="rounded-lg focus:outline-none"
											:class="selectedEmotion.label === face.label ? `border-2 border-primary` : ``"
											@click="setEmotion(face)"
										>
											<img :src="face.leftImage" :alt="face.label" class="w-24 h-24" />
										</button>
										<p
											v-for="face in row"
											:key="face.label + face.label"
											class="flex flex-grow justify-center items-center capitalize"
											:class="selectedEmotion.label === face.label ? `font-bold text-primary` : `text-gray7`"
										>
											{{ face.label }}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- Bottom overlay with selector -->
			<div v-show="showEmotions" class="w-full flex flex-row-reverse">
				<div
					class="z-10 bg-white flex flex-row-reverse items-end p-5"
					style="height: 112px; margin-top: -112px"
					:style="$route.name === `post-post` ? `width: 450px` : `width: 406px`"
				>
					<button class="rounded-lg bg-primary text-white px-6 py-2 focus:outline-none" @click="confirmEmotion">
						Select
					</button>
				</div>
			</div>
			<Comment
				v-for="c in comments"
				:key="c._id"
				class="py-2"
				:authorID="c.authorID"
				:cid="c._id"
				:timestamp="c.timestamp"
			/>
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
import CloseIcon from '@/components/icons/X.vue'
import StatsIcon from '@/components/icons/Stats.vue'
import ChevronLeft from '@/components/icons/ChevronLeft.vue'

import { faces, feelings, faceGroupings } from '@/config'
import { createComment, sendComment, ICommentData, getCommentsOfPost } from '@/backend/comment'

interface IData {
	faceGroupings: object[]
	feelingList: Record<string, any>
	activeEmotion: { label: string; leftImage: any; rightImage: any }
	selectedEmotion: { label: string; leftImage: any; rightImage: any }
	comments: ICommentData[]
	comment: string
	emotion: string
	showEmotions: boolean
	commentBackground: string
	filter: string
	showDropdown: boolean
	showStats: boolean
	toggleStats: boolean
}

export default Vue.extend({
	name: `ComponentPostActions`,
	components: {
		BrandedButton,
		Comment,
		CommentFilter,
		FlipIcon,
		CloseIcon,
		StatsIcon,
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
		bookmarksCount: {
			type: Number,
			default: -1,
		},
		repostsCount: {
			type: Number,
			default: -1,
		},
	},
	data(): IData {
		return {
			faceGroupings,
			feelingList: feelings,
			activeEmotion: { label: ``, leftImage: null, rightImage: null },
			selectedEmotion: { label: ``, leftImage: null, rightImage: null },
			comment: ``,
			comments: [],
			emotion: ``,
			showEmotions: false,
			commentBackground: `@/assets/images/brand/paper4.svg`,
			filter: ``,
			showDropdown: false,
			showStats: false,
			toggleStats: false,
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
	mounted() {
		const scroller = this.$refs.scrollContainer as HTMLElement
		scroller.addEventListener(`scroll`, this.handleScrollContainer)
	},
	methods: {
		handleScrollContainer(e: Event): void {
			if (e.target) {
				// const { scrollTop, scrollHeight } = e.srcElement as HTMLElement
				// eslint-disable-next-line no-console
				// console.log(`scrollTop`, scrollTop)
				// eslint-disable-next-line no-console
				// console.log(`scrollHeight`, scrollHeight)
			}
		},
		setFilter(reaction: string): void {
			this.filter = reaction
			this.filterComments()
		},
		setEmotion(r: { label: string; leftImage: any; rightImage: any }) {
			this.selectedEmotion = r
		},
		confirmEmotion() {
			if (this.selectedEmotion.label === ``) {
				this.$toastWarning(`No face selected!`)
				return
			}
			this.activeEmotion = this.selectedEmotion
			this.$toastSuccess(`You're feeling ` + this.activeEmotion.label)
			this.showEmotions = false
		},
		async sendComment() {
			if (this.activeEmotion.label === ``) {
				this.$toastError(`Please select a reaction`)
				return
			}
			if (this.comment.length < 1 || this.comment.length > 5000) {
				this.$toastError(`Comment length too short or too long`)
				return
			}
			if (!this.$qualityText(this.comment)) {
				this.$toastError(`invalid comment!`)
				return
			}
			const c = createComment(this.$store.state.session.id, this.comment, this.activeEmotion.label, this.postCID)
			const _id = await sendComment(c, `comment`)
			// Send comment (c)
			this.comments.push({ _id, ...c })
			// Apply filter to comments, in case new comment was added in filtered category
			this.comment = ``
			this.filterComments()
			this.selectedEmotion = { label: ``, leftImage: null, rightImage: null }
			this.activeEmotion = { label: ``, leftImage: null, rightImage: null }
			this.emotion = ``
			this.filter = ``
			this.filterComments()
		},
		async filterComments() {
			// Fetch comments
			if (this.filter === ``) {
				const cList: ICommentData[] = await getCommentsOfPost(this.postCID)
				this.comments = cList.reverse()
			} else {
				// Get a list of comments with multiple emotions under the same category
				if (this.filter === `positive` || this.filter === `neutral` || this.filter === `negative`) {
					const cList: ICommentData[] = await getCommentsOfPost(this.postCID, undefined, this.filter)
					this.comments = cList.reverse()
					return
				}
				// Get a list of comments with a specific emotion
				const cList: ICommentData[] = await getCommentsOfPost(
					this.postCID,
					this.filter.charAt(0).toLowerCase() + this.filter.replace(/\s/g, ``).substring(1),
				)
				this.comments = cList.reverse()
			}
		},
		getCommentCount(type: `total` | `positive` | `neutral` | `negative`): number {
			if (type === `total`) {
				return this.comments.length
			}
			let count: number = 0
			for (const c in this.comments) {
				if (c) {
					const reaction = this.comments[c].emotion as keyof typeof faces
					if (reaction in faces) {
						const label = faces[reaction].label
						// console.log(label)
						if (feelings[type].includes(label)) {
							count++
						}
					}
				}
			}
			return count
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
