<template>
	<section>
		<!-- Stats -->
		<article v-show="toggleStats" class="pt-5">
			<!-- Back button -->
			<div class="flex items-center">
				<button class="rounded-full bg-gray1 focus:outline-none" @click="toggleStats = false"><ChevronLeft /></button>
				<span class="pl-2 font-semibold text-sm" style="margin-bottom: 2px">All comments</span>
			</div>
			<!-- Global Activity -->
			<div class="pt-5 border-b h-32 flex justify-between">
				<!-- Stats image -->
				<img :src="require(`@/assets/images/brand/stats.webp`)" class="h-full flex-shrink-0 pl-5" />
				<!-- Text stats -->
				<div class="flex flex-col w-3/5">
					<h6 class="text-sm pb-4 font-semibold">Global Post Activity</h6>
					<div class="flex flex-row">
						<!-- Bookmarks Count -->
						<div class="flex flex-col pr-5">
							<h2 class="text-2xl font-semibold">{{ bookmarksCount }}</h2>
							<span class="text-sm">Bookmarks</span>
						</div>
						<!-- Reposts count -->
						<div class="flex flex-col">
							<h2 class="text-2xl font-semibold">{{ repostsCount }}</h2>
							<span class="text-sm">Reposts</span>
						</div>
					</div>
				</div>
			</div>
			<!-- Comments Activity -->
			<div class="border-b flex justify-between h-48">
				<!-- Graph breakdown -->
				<div class="flex flex-row h-full self-end ml-5">
					<!-- Positive -->
					<span
						class="bg-positive w-6 self-end rounded-t-full"
						:style="`height: ` + (getCommentCount(`positive`) / getCommentCount(`total`)) * 100 + `%`"
					></span>
					<!-- Neutral -->
					<span
						class="bg-neutral w-6 self-end rounded-t-full mx-2"
						:style="`height: ` + (getCommentCount(`neutral`) / getCommentCount(`total`)) * 100 + `%`"
					></span>
					<!-- Negative -->
					<span
						class="bg-negative w-6 self-end rounded-t-full"
						:style="`height: ` + (getCommentCount(`negative`) / getCommentCount(`total`)) * 100 + `%`"
					></span>
				</div>
				<!-- Text stats -->
				<div class="flex flex-col w-3/5 pt-5">
					<h6 class="text-sm pb-4 font-semibold">Comment Activity</h6>
					<!-- Bookmarks Count -->
					<div class="flex flex-row mb-2">
						<div class="flex flex-col pr-4">
							<h2 class="text-2xl font-semibold">{{ getCommentCount(`total`) }}</h2>
							<span class="text-sm">Total comments</span>
						</div>
					</div>
					<!-- Type breakdown Count -->
					<div class="flex flex-row">
						<div class="flex flex-col pr-4">
							<h2 class="text-2xl font-semibold text-lightPrimary">{{ getCommentCount(`positive`) }}</h2>
							<span class="text-sm">Positive</span>
						</div>
						<div class="flex flex-col pr-4">
							<h2 class="text-2xl font-semibold text-neutral">{{ getCommentCount(`neutral`) }}</h2>
							<span class="text-sm">Neutral</span>
						</div>
						<div class="flex flex-col pr-4">
							<h2 class="text-2xl font-semibold text-negative">{{ getCommentCount(`negative`) }}</h2>
							<span class="text-sm">Negative</span>
						</div>
					</div>
				</div>
			</div>
			<!-- Comment Emoitons -->
			<div v-if="getCommentCount(`total`) !== 0" class="pt-5 border-b pb-2">
				<h6 class="text-sm pb-4 w-full text-center font-semibold">Comment Emotions</h6>
				<!-- Row of faces -->
				<div class="flex">
					<button v-show="page > 0" class="focus:outline-none" @click="page = page - 1"><ChevronLeft /></button>
					<div class="grid grid-cols-6 w-full">
						<div v-for="f in faceStats.slice(page * 6, page * 6 + 6)" :key="f.face.label" class="flex flex-col w-24">
							<div class="rounded-lg border flex flex-col p-1" :class="`border-` + getStyle(f.face.label)">
								<span class="text-xs self-center">{{ f.face.label }}</span>
								<img :src="f.face.leftImage" :alt="f.face.label" class="w-16 h-16 self-center" />
							</div>
							<span class="self-center text-sm font-semibold mt-1"
								>{{ ((f.count / getCommentCount(`total`)) * 100).toFixed(1) }}%</span
							>
						</div>
					</div>
					<button v-show="6 * page + 6 < faceStats.length" class="focus:outline-none" @click="page = page + 1">
						<ChevronRight />
					</button>
				</div>
			</div>
		</article>
		<!-- Post a Comment -->
		<article v-show="!toggleStats" class="pb-5">
			<div class="w-full flex justify-between py-5">
				<div class="flex flex-row items-center">
					<span class="pr-2 font-semibold">{{ getCommentCount(`total`) }} comments</span>
					<button class="focus:outline-none ml-2" @click="toggleStats = true"><StatsIcon /></button>
				</div>
				<CommentFilter :filter="filter" @clicked="setFilter" />
			</div>
			<!-- Bottom overlay with selector -->
			<div v-show="showEmotions" class="w-full flex flex-row-reverse">
				<div
					class="z-10 bg-white flex flex-row justify-between p-5 rounded-tr-lg mr-1"
					:style="$route.name === `post-post` ? `width: 490px` : `width: 406px`"
					style="margin-bottom: -112px; margin-top: 1px"
				>
					<h6 class="text-primary text-2xl text-center self-center font-semibold">How do you feel?</h6>
					<div>
						<button class="p-1 bg-gray1 rounded-full focus:outline-none" @click="showEmotions = false">
							<CloseIcon />
						</button>
					</div>
				</div>
				<div
					class="z-10 bg-white flex flex-row justify-between p-5 rounded-tl-lg"
					:style="$route.name === `post-post` ? `width: 350px` : `width: 306px`"
					style="
						margin-bottom: -112px;
						background: linear-gradient(#ffffff, rgba(255, 255, 255, 0));
						pointer-events: none;
						margin-top: 1px;
						margin-left: 1px;
					"
				></div>
			</div>
			<div class="flex items-start">
				<!-- Comment box Container -->
				<div v-show="!showEmotions" class="flex justify-between items-start mr-4" style="width: 60px; height: 60px">
					<span class="rounded-lg flex-shrink-0" :style="getStyle(`bg-`)">
						<Avatar :avatar="avatar" :authorID="$store.state.session.id" />
					</span>
				</div>
				<div
					class="flex rounded-xl w-full overflow-hidden bg-neutralLightest border border-lightBorder"
					:class="showEmotions ? `` : `border border-lightBorder p-4`"
				>
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
									<span v-else><FlipIcon class="mx-4" style="width: 80px; height: 80px" /></span>
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
											:class="comment !== '' && activeEmotion.label !== '' ? '' : 'opacity-50'"
										/>
									</span>
								</div>
							</div>
							<!-- Back side: Choose reaction -->
							<div
								v-show="showEmotions"
								ref="scrollContainer"
								class="w-full overflow-y-scroll bg-white px-6"
								style="height: 320px; scroll-snap-type: y mandatory; scroll-snap-stop: always"
							>
								<!-- Middle selector area -->
								<div
									class="absolute rounded-lg bg-positive bg-opacity-25 p-2"
									style="height: 96px; margin-top: 112px"
									:style="$route.name === `post-post` ? `width: 716px` : `width: 655px`"
								></div>
								<!-- Faces grid -->
								<div class="relative" style="padding-bottom: 120px; padding-top: 120px">
									<div
										v-for="row in faceGroupings"
										:key="row[0].label + row[1].label + row[2].label"
										class="flex flex-row w-full relative px-2"
										style="scroll-snap-align: center"
									>
										<button
											v-for="face in row"
											:key="face.label"
											class="rounded-lg focus:outline-none border-2 border-transparent outline-none"
											:class="selectedEmotion.label === face.label ? `border-2 border-primary` : ``"
											style="transition: all 0.3s ease-in-out"
											@click="setEmotion(face)"
										>
											<img :src="face.leftImage" :alt="face.label" class="w-20 h-20" />
										</button>
										<div
											v-for="face in row"
											:key="face.label + face.label"
											class="flex flex-grow justify-center items-center face-tag"
										>
											<button
												class="flex flex-grow justify-center items-center focus:outline-none outline-none"
												:class="selectedEmotion.label === face.label ? `font-bold text-positive` : `text-gray7`"
												style="transition: all 0.3s ease-in-out"
												@click="setEmotion(face)"
											>
												<p class="capitalize">
													{{ face.label }}
												</p>
											</button>
											<div class="h-1 w-1 rounded-full bg-gray5 separator"></div>
										</div>
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
					class="z-10 bg-white flex flex-row-reverse items-end p-5 rounded-br-lg mr-1"
					style="height: 111px; margin-top: -112px; margin-bottom: 1px"
					:style="$route.name === `post-post` ? `width: 490px` : `width: 406px`"
				>
					<button class="rounded-lg bg-primary text-white px-6 py-2 focus:outline-none" @click="confirmEmotion">
						Select
					</button>
				</div>
				<div
					class="z-10 bg-white flex flex-row-reverse items-end p-5 rounded-bl-lg"
					style="
						height: 111px;
						margin-top: -112px;
						background: linear-gradient(rgba(255, 255, 255, 0), #ffffff);
						pointer-events: none;
						margin-bottom: 1px;
						margin-left: 1px;
					"
					:style="$route.name === `post-post` ? `width: 350px` : `width: 306px`"
				></div>
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
import _ from 'lodash'
import BrandedButton from '@/components/BrandedButton.vue'
import Comment from '@/components/post/Comment.vue'
import CommentFilter from '@/components/post/CommentFilter.vue'
import FlipIcon from '@/components/icons/Flip.vue'
import CloseIcon from '@/components/icons/X.vue'
import StatsIcon from '@/components/icons/Stats.vue'
import ChevronLeft from '@/components/icons/ChevronLeft.vue'
import ChevronRight from '@/components/icons/ChevronRight.vue'
import Avatar from '@/components/Avatar.vue'

import { faces, feelings, faceGroupings } from '@/config'
import { createComment, sendComment, ICommentData, getCommentsOfPost } from '@/backend/comment'

interface FaceStat {
	face: { label: string; leftImage: any; rightImage: any }
	count: number
}

interface IData {
	faceGroupings: object[]
	feelingList: Record<string, any>
	activeEmotion: { label: string; leftImage: any; rightImage: any }
	selectedEmotion: { label: string; leftImage: any; rightImage: any }
	comments: ICommentData[]
	avatar: string
	comment: string
	emotion: string
	showEmotions: boolean
	commentBackground: string
	filter: string
	showDropdown: boolean
	toggleStats: boolean
	faceStats: FaceStat[]
	page: number
}

export default Vue.extend({
	name: `ComponentPostActions`,
	components: {
		BrandedButton,
		Comment,
		Avatar,
		CommentFilter,
		FlipIcon,
		CloseIcon,
		StatsIcon,
		ChevronLeft,
		ChevronRight,
	},
	props: {
		postCID: {
			type: String as PropType<string>,
			required: true,
		},
		bookmarksCount: {
			type: Number,
			default: -1,
		},
		repostsCount: {
			type: Number,
			default: -1,
		},
		openStats: {
			type: Boolean,
			default: false,
		},
	},
	data(): IData {
		return {
			faceGroupings,
			feelingList: feelings,
			avatar: ``,
			activeEmotion: { label: ``, leftImage: null, rightImage: null },
			selectedEmotion: { label: ``, leftImage: null, rightImage: null },
			comment: ``,
			comments: [],
			emotion: ``,
			showEmotions: false,
			commentBackground: `@/assets/images/brand/paper4.svg`,
			filter: ``,
			showDropdown: false,
			toggleStats: this.$props.openStats,
			faceStats: [],
			page: 0,
		}
	},
	async created() {
		this.comments = await getCommentsOfPost(this.postCID)
		this.comments = this.comments.reverse()
		// get comment stats
		this.updateFaceStats()
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
			this.updateFaceStats()
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
		updateFaceStats(): void {
			this.faceStats = []
			for (const c in this.comments) {
				if (c) {
					const reaction = this.comments[c].emotion as keyof typeof faces
					if (reaction in faces) {
						const f = faces[reaction]
						const i = this.faceStats.findIndex((x) => x.face === f)
						if (i > -1) {
							// Not the first entry
							this.faceStats[i].count++
						} else {
							this.faceStats.push({ face: f, count: 1 })
						}
					}
				}
			}
			this.faceStats = _.sortBy(this.faceStats, `count`).reverse()
		},
		getStyle(emotionType: string): string {
			if (feelings.positive.includes(emotionType)) {
				return `positive`
			} else if (feelings.negative.includes(emotionType)) {
				return `negative`
			} else {
				return `neutral`
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

.face-tag:last-child .separator {
	display: none;
}
</style>
