<template>
	<section>
		<!-- Stats -->
		<article v-show="toggleStats" class="pt-5">
			<!-- Back button -->
			<div class="flex items-center">
				<button class="bg-gray1 focus:outline-none rounded-full" @click="toggleStats = false"><ChevronLeft /></button>
				<span class="pl-2 text-sm font-semibold" style="margin-bottom: 2px">All comments</span>
			</div>
			<!-- Global Activity -->
			<div class="flex h-32 justify-between border-b pt-5">
				<!-- Stats image -->
				<img :src="require(`@/assets/images/brand/stats.webp`)" class="hidden h-full flex-shrink-0 pl-5 xl:block" />
				<!-- Text stats -->
				<div class="flex w-3/5 flex-col">
					<h6 class="pb-4 text-sm font-semibold">Global Post Activity</h6>
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
			<div class="flex h-48 justify-between border-b">
				<!-- Graph breakdown -->
				<div class="ml-5 pt-4 hidden h-full flex-row self-end xl:flex">
					<!-- Positive -->
					<span
						class="bg-positive w-6 self-end rounded-t-full"
						:style="`height: ` + (getCommentCount(`positive`) / getCommentCount(`total`)) * 100 + `%`"
					></span>
					<!-- Neutral -->
					<span
						class="bg-neutral mx-2 w-6 self-end rounded-t-full"
						:style="`height: ` + (getCommentCount(`neutral`) / getCommentCount(`total`)) * 100 + `%`"
					></span>
					<!-- Negative -->
					<span
						class="bg-negative w-6 self-end rounded-t-full"
						:style="`height: ` + (getCommentCount(`negative`) / getCommentCount(`total`)) * 100 + `%`"
					></span>
				</div>
				<!-- Text stats -->
				<div class="flex w-3/5 flex-col pt-5">
					<h6 class="pb-4 text-sm font-semibold">Comment Activity</h6>
					<!-- Bookmarks Count -->
					<div class="mb-2 flex flex-row">
						<div class="flex flex-col pr-4">
							<h2 class="text-2xl font-semibold">{{ getCommentCount(`total`) }}</h2>
							<span class="text-sm">Total comments</span>
						</div>
					</div>
					<!-- Type breakdown Count -->
					<div class="flex flex-row">
						<div class="flex flex-col pr-4">
							<h2 class="text-lightPrimary text-2xl font-semibold">{{ getCommentCount(`positive`) }}</h2>
							<span class="text-sm">Positive</span>
						</div>
						<div class="flex flex-col pr-4">
							<h2 class="text-neutral text-2xl font-semibold">{{ getCommentCount(`neutral`) }}</h2>
							<span class="text-sm">Neutral</span>
						</div>
						<div class="flex flex-col pr-4">
							<h2 class="text-negative text-2xl font-semibold">{{ getCommentCount(`negative`) }}</h2>
							<span class="text-sm">Negative</span>
						</div>
					</div>
				</div>
			</div>
			<!-- Comment Emotions -->
			<div v-if="getCommentCount(`total`) !== 0" class="border-b pt-5 pb-2">
				<h6 class="w-full pb-4 text-center text-sm font-semibold">Comment Emotions</h6>
				<!-- Row of faces -->
				<div class="flex">
					<button v-show="page > 0" class="focus:outline-none" @click="page = page - 1"><ChevronLeft /></button>
					<div class="grid w-full grid-cols-3 xl:grid-cols-6">
						<div v-for="f in faceStats.slice(page * 6, page * 6 + 6)" :key="f.face.label" class="flex w-24 flex-col">
							<div class="flex flex-col rounded-lg border p-1" :class="`border-` + getStyle(f.face.label)">
								<span class="self-center text-xs">{{ f.face.label }}</span>
								<img :src="f.face.image" :alt="f.face.label" class="h-16 w-16 self-center" />
							</div>
							<span class="mt-1 self-center text-sm font-semibold"
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
		<article v-show="!toggleStats" id="section">
			<div class="flex w-full justify-between py-5">
				<div class="flex flex-row items-center">
					<span class="pr-2 font-semibold">{{ getCommentCount(`total`) }} comments</span>
					<button class="focus:outline-none ml-2" @click="toggleStats = true"><StatsIcon /></button>
				</div>
				<CommentFilter
					v-show="!showEmotions && (comments.length > 0 || this.filter !== ``)"
					:filter="filter"
					class="modal-animation"
					@clicked="setFilter"
				/>
			</div>
			<!-- Top overlay with selector -->
			<div v-show="showEmotions" class="relative flex w-full flex-row-reverse">
				<div
					class="z-10 mr-1 hidden xl:flex flex-row justify-between rounded-tr-lg bg-white p-5 xl:w-3/5"
					style="margin-bottom: -112px; margin-top: 1px; pointer-events: none"
				>
					<h6 class="text-primary self-center text-center text-2xl font-semibold">How do you feel?</h6>
				</div>
				<div class="absolute z-20 mt-8 xl:mt-10 mr-8 flex items-center">
					<button class="bg-gray1 focus:outline-none rounded-full p-1" @click="showEmotions = false">
						<CloseIcon />
					</button>
				</div>
				<div
					class="z-10 flex flex-row justify-between rounded-tl-lg bg-white p-5 w-full xl:w-2/5 mr-1 xl:mr-0"
					style="
						margin-bottom: -112px;
						background: linear-gradient(#ffffff, rgba(255, 255, 255, 0));
						pointer-events: none;
						margin-top: 1px;
						margin-left: 1px;
					"
				></div>
			</div>
			<div class="flex flex-col items-start xl:flex-row">
				<!-- Comment box Container -->
				<div
					v-show="!showEmotions"
					class="mr-4 hidden items-start justify-between xl:flex"
					style="width: 60px; height: 60px"
				>
					<Avatar
						:avatar="$store.state.session.id === `` ? require(`@/assets/images/avatars/unauthenticated.webp`) : avatar"
						:authorID="$store.state.session.id"
						class="flex-shrink-0 rounded-xl border-4"
						:class="`border-` + selectedEmotionColor"
						:noClick="true"
					/>
				</div>
				<div
					id="faceSelector"
					class="border-lightBorder flex w-full overflow-hidden rounded-xl border"
					:class="showEmotions ? `` : `border p-2 bg-` + selectedEmotionColor"
				>
					<div
						class="flex w-full items-center justify-center overflow-hidden rounded-xl relative"
						:style="showEmotions ? `height: 20rem` : `height: 10rem`"
					>
						<div v-if="this.$store.state.session.id !== ``" class="flex w-full flex-row">
							<!-- Front side: Type comment -->
							<div v-show="!showEmotions" class="flex w-full bg-white">
								<button class="focus:outline-none h-auto flex-shrink-0" @click="toggleShowEmotions">
									<span v-if="activeEmotion.label !== ``">
										<img
											:src="activeEmotion.image"
											:alt="activeEmotion.label"
											class="object-contain w-24 h-24 xl:w-32 xl:h-32"
											style="transform: rotateY(180deg)"
										/>
									</span>
									<span v-else
										><FlipIcon
											class="transition duration-500 ease-in-out opacity-50 hover:opacity-100 w-24 h-24 xl:w-32 xl:h-32"
									/></span>
								</button>
								<textarea
									v-if="comments.length > 0"
									v-model="comment"
									class="focus:outline-none mr-6 h-40 w-full resize-none overflow-y-auto py-4 pl-2 pr-10 xl:pr-16 leading-normal"
									name="body"
									placeholder="What's your response?"
								/>
								<textarea
									v-else
									v-model="comment"
									class="focus:outline-none mr-6 h-40 w-full resize-none overflow-y-auto py-4 pl-2 pr-10 xl:pr-16 leading-normal"
									name="body"
									placeholder="Be the first one commenting this post..."
								/>
								<div class="relative">
									<span class="absolute bottom-0 right-0 flex flex-col">
										<button
											class="bg-primary focus:outline-none block rounded-lg xl:hidden"
											style="margin-right: 15.2px; margin-bottom: 15px"
											:class="comment !== '' && activeEmotion.label !== '' ? '' : 'opacity-50'"
											@click="sendComment"
										>
											<SendIcon class="m-2 mb-3 ml-3 h-5 w-5 text-white transform rotate-45" />
										</button>
										<BrandedButton
											style="margin-right: 15.2px; margin-bottom: 15px"
											text="Post"
											class="hidden xl:block"
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
								class="modal-animation w-full overflow-y-scroll bg-white px-4 xl:px-6 flex justify-center"
								style="height: 320px; scroll-snap-type: y mandatory; scroll-snap-stop: always"
							>
								<!-- Middle selector area -->
								<div
									class="absolute rounded-lg p-2 h-32 xl:h-24 mt-24 xl:mt-28"
									:class="
										selectedEmotionColor === `positive` ||
										selectedEmotionColor === `neutral` ||
										selectedEmotionColor === `negative`
											? `bg-opacity-25 bg-` + selectedEmotionColor
											: `bg-gray1`
									"
									style="width: 92%"
								></div>
								<!-- Faces grid -->
								<div class="relative w-full" style="padding-bottom: 120px; padding-top: 120px">
									<div
										v-for="row in faceGroupings"
										:key="row[0].label + row[1].label + row[2].label"
										class="relative flex w-full flex-row mb-2 xl:px-2 justify-between"
										style="scroll-snap-align: center"
									>
										<button
											v-for="face in row"
											:key="face.label"
											class="focus:outline-none outline-none rounded-lg border-2 border-transparent"
											:class="selectedEmotion.label === face.label ? `border-2 border-` + selectedEmotionColor : ``"
											style="transition: all 0.3s ease-in-out"
											@click="setEmotion(face)"
										>
											<img :src="face.image" :alt="face.label" class="h-20 w-20" style="transform: rotateY(180deg)" />
											<p
												class="capitalize xl:hidden mt-1"
												:class="
													selectedEmotion.label === face.label ? `font-bold text-` + selectedEmotionColor : `text-gray7`
												"
											>
												{{ face.label }}
											</p>
										</button>
										<div
											v-for="face in row"
											:key="face.label + face.label"
											class="face-tag hidden xl:flex flex-grow items-center justify-center"
										>
											<button
												class="focus:outline-none outline-none flex flex-grow items-center justify-center"
												:class="
													selectedEmotion.label === face.label ? `font-bold text-` + selectedEmotionColor : `text-gray7`
												"
												style="transition: all 0.3s ease-in-out"
												@click="setEmotion(face)"
											>
												<p class="capitalize">
													{{ face.label }}
												</p>
											</button>
											<div class="bg-gray5 separator h-1 w-1 rounded-full"></div>
										</div>
									</div>
									<!-- Extra row for spacing -->
									<div class="w-full" style="height: 120px"></div>
								</div>
							</div>
						</div>
						<div v-else class="text-gray5 pt-3 text-sm">
							<button class="text-primary focus:outline-none ml-1" @click="$router.push(`/register`)">Sign up</button>
							to comment on this post and be part of the debate
						</div>
					</div>
				</div>
			</div>
			<!-- Bottom overlay with selector -->
			<div v-show="showEmotions" class="relative flex w-full flex-row-reverse">
				<div
					class="z-10 mr-1 hidden xl:flex flex-row-reverse items-end rounded-br-xl bg-white p-5 xl:w-3/5"
					style="height: 111px; margin-top: -112px; margin-bottom: 1px; pointer-events: none"
				></div>
				<button
					class="bg-primary focus:outline-none absolute bottom-0 right-0 z-20 mb-7 mr-7 rounded-lg px-6 py-2 text-white"
					@click="confirmEmotion"
				>
					Select
				</button>
				<div
					class="z-10 flex flex-row-reverse items-end rounded-bl-lg bg-white p-5 w-full mr-1 xl:mr-0 xl:w-2/5"
					style="
						height: 111px;
						margin-top: -112px;
						background: linear-gradient(rgba(255, 255, 255, 0), #ffffff);
						pointer-events: none;
						margin-bottom: 1px;
						margin-left: 1px;
					"
				></div>
			</div>
			<Comment
				v-for="c in comments"
				:key="c._id"
				class="py-2"
				:authorID="c.authorID"
				:postAuthor="postAuthor"
				:cid="c._id"
				:timestamp="c.timestamp"
			/>
			<div v-if="comments.length === 0 && filter !== ``" class="text-gray5 pt-5 text-sm text-center">
				No comments under this filter
			</div>
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
import SendIcon from '@/components/icons/Send.vue'
import CloseIcon from '@/components/icons/X.vue'
import StatsIcon from '@/components/icons/Stats.vue'
import ChevronLeft from '@/components/icons/ChevronLeft.vue'
import ChevronRight from '@/components/icons/ChevronRight.vue'
import Avatar from '@/components/Avatar.vue'

import { faces, feelings, faceGroupings } from '@/config'
import { createComment, sendComment, ICommentData, getCommentsOfPost } from '@/backend/comment'
import { getPhotoFromIPFS } from '@/backend/photos'

interface FaceStat {
	face: { label: string; image: any }
	count: number
}

interface IData {
	faceGroupings: object[]
	feelingList: Record<string, any>
	activeEmotion: { label: string; image: any }
	selectedEmotion: { label: string; image: any }
	comments: ICommentData[]
	avatar: string
	comment: string
	emotion: string
	showEmotions: boolean
	filter: string
	showDropdown: boolean
	toggleStats: boolean
	faceStats: FaceStat[]
	page: number
	selectedEmotionColor: `positive` | `neutral` | `negative` | `neutralLightest`
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
		SendIcon,
	},
	props: {
		postCID: {
			type: String as PropType<string>,
			required: true,
		},
		postAuthor: {
			type: String,
			default: ``,
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
			activeEmotion: { label: ``, image: null },
			selectedEmotion: { label: ``, image: null },
			comment: ``,
			comments: [],
			emotion: ``,
			showEmotions: false,
			filter: ``,
			showDropdown: false,
			toggleStats: this.openStats,
			faceStats: [],
			page: 0,
			selectedEmotionColor: `neutralLightest`,
		}
	},
	async created() {
		this.comments = await getCommentsOfPost(this.postCID)
		this.comments = this.comments.reverse()
		// get comment stats
		this.updateFaceStats()
		if (this.$store.state.session.avatar !== ``) {
			getPhotoFromIPFS(this.$store.state.session.avatar).then((a) => {
				this.avatar = a
			})
		}
	},
	methods: {
		async toggleShowEmotions() {
			this.showEmotions = !this.showEmotions
			if (this.comments.length === 0) {
				await this.sleep(100)
			}
			const body = document.getElementById(`faceSelector`)
			if (!body) {
				return
			}
			body.scrollIntoView({ block: `center` })
		},
		setFilter(reaction: string): void {
			this.filter = reaction
			this.filterComments()
		},
		setEmotion(r: { label: string; image: any }) {
			this.selectedEmotion = r
			if (feelings.positive.has(r.label)) {
				this.selectedEmotionColor = `positive`
				return
			}
			if (feelings.negative.has(r.label)) {
				this.selectedEmotionColor = `negative`
				return
			}

			this.selectedEmotionColor = `neutral`
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
			const commentQualityCheck = this.$qualityComment(this.comment)
			if (this.$isError(commentQualityCheck)) {
				this.$toastError(commentQualityCheck.error)
				return
			}
			const c = createComment(this.$store.state.session.id, this.comment, this.activeEmotion.label, this.postCID)
			const _id = await sendComment(c, `comment`)
			// Send comment (c)
			this.comments.push({ _id, ...c })
			// Apply filter to comments, in case new comment was added in filtered category
			this.comment = ``
			this.filterComments()
			this.selectedEmotion = { label: ``, image: null }
			this.activeEmotion = { label: ``, image: null }
			this.emotion = ``
			this.filter = ``
			this.selectedEmotionColor = `neutralLightest`
			this.filterComments()
			this.updateFaceStats()
		},
		async filterComments() {
			// Fetch comments
			let cList: ICommentData[] = []
			if (this.filter === ``) {
				cList = await getCommentsOfPost(this.postCID)
			} else if (this.filter === `positive` || this.filter === `neutral` || this.filter === `negative`) {
				// Get a list of comments with multiple emotions under the same category
				cList = await getCommentsOfPost(this.postCID, undefined, this.filter)
			} else {
				// Get a list of comments with a specific emotion
				cList = await getCommentsOfPost(
					this.postCID,
					this.filter.charAt(0).toLowerCase() + this.filter.replace(/\s/g, ``).substring(1),
				)
			}

			this.comments = cList.reverse()
		},
		getCommentCount(type: `total` | `positive` | `neutral` | `negative`): number {
			if (type === `total`) {
				return this.comments.length
			}
			let count: number = 0
			for (const c of this.comments) {
				const reaction = c.emotion as keyof typeof faces
				if (!(reaction in faces)) {
					continue
				}

				const label = faces[reaction].label
				if (feelings[type].has(label)) {
					count++
				}
			}
			return count
		},
		updateFaceStats(): void {
			const stats: Record<string, FaceStat> = {}
			for (const c of this.comments) {
				const reaction = c.emotion as keyof typeof faces
				if (!(reaction in faces)) {
					continue
				}

				const f = faces[reaction]
				if (stats[f.label]) {
					// Not the first entry
					stats[f.label].count++
					continue
				}

				stats[f.label] = { face: f, count: 1 }
			}
			this.faceStats = _.sortBy(Object.values(stats), `count`).reverse()
		},
		getStyle(emotionType: string): string {
			if (feelings.positive.has(emotionType)) {
				return `positive`
			}
			if (feelings.negative.has(emotionType)) {
				return `negative`
			}

			return `neutral`
		},
		sleep(ms: any) {
			return new Promise((resolve) => setTimeout(resolve, ms))
		},
	},
})
</script>

<style>
/* Custom scrollbar */
.faces::-webkit-scrollbar {
	width: 5px;
	border-radius: 50px;
}
/* Track */
.faces::-webkit-scrollbar-track {
	border-radius: 0.75rem;
	background: #eeeeee;
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
