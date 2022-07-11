<template>
	<section ref="postActions">
		<!-- Stats -->
		<article v-show="toggleStats" class="pt-5 modal-animation">
			<!-- Back button -->
			<div class="flex items-center">
				<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full" @click="toggleStats = false">
					<ChevronLeft />
				</button>
				<span class="pl-2 text-sm font-semibold dark:text-darkPrimaryText" style="margin-bottom: 2px"
					>All comments</span
				>
			</div>
			<!-- Global Activity -->
			<div class="flex h-32 justify-between items-center border-b pt-5">
				<!-- Stats image -->
				<div class="w-2/5 hidden lg:block">
					<nuxt-img loading="lazy" src="/images/stats.webp" class="h-28 flex-shrink-0 pl-5" />
				</div>
				<!-- Text stats -->
				<div class="flex w-2/5 flex-col dark:text-darkPrimaryText">
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
				<button v-if="profiles.length > 0" class="text-sm text-primary w-1/5 h-fit" @click="openReposters">
					See reposters
				</button>
				<button v-else class="text-sm text-primary w-1/5 h-fit cursor-default" disabled style="opacity: 0">
					See reposters
				</button>
			</div>
			<!-- Comments Activity -->
			<div class="flex h-44 justify-between">
				<!-- Graph breakdown -->
				<div
					v-if="commentsStats.positive + commentsStats.neutral + commentsStats.negative !== 0"
					class="ml-5 pt-4 hidden h-full flex-row self-end lg:flex"
				>
					<!-- Positive -->
					<span
						class="bg-positive w-6 self-end rounded-t-full"
						:style="`height: ` + (commentsStats.positive / commentsStats.total) * 100 + `%`"
					></span>
					<!-- Neutral -->
					<span
						class="bg-neutral mx-2 w-6 self-end rounded-t-full"
						:style="`height: ` + (commentsStats.neutral / commentsStats.total) * 100 + `%`"
					></span>
					<!-- Negative -->
					<span
						class="bg-negative w-6 self-end rounded-t-full"
						:style="`height: ` + (commentsStats.negative / commentsStats.total) * 100 + `%`"
					></span>
				</div>
				<div
					v-else
					class="ml-5 pt-4 hidden h-full flex-row self-end items-center lg:flex text-sm text-gray5 dark:text-gray3"
				>
					no comments
				</div>
				<!-- Text stats -->
				<div class="flex w-3/5 flex-col pt-5 dark:text-darkPrimaryText">
					<h6 class="pb-4 text-sm font-semibold">Comment Activity</h6>
					<!-- Bookmarks Count -->
					<div class="mb-2 flex flex-row">
						<div class="flex flex-col pr-4">
							<h2 class="text-2xl font-semibold">{{ commentsStats.total }}</h2>
							<span class="text-sm">Total comments</span>
						</div>
					</div>
					<!-- Type breakdown Count -->
					<div class="flex flex-row">
						<div class="flex flex-col pr-4">
							<h2 class="text-positive text-2xl font-semibold">{{ commentsStats.positive }}</h2>
							<span class="text-sm">Positive</span>
						</div>
						<div class="flex flex-col pr-4">
							<h2 class="text-neutral text-2xl font-semibold">{{ commentsStats.neutral }}</h2>
							<span class="text-sm">Neutral</span>
						</div>
						<div class="flex flex-col pr-4">
							<h2 class="text-negative text-2xl font-semibold">{{ commentsStats.negative }}</h2>
							<span class="text-sm">Negative</span>
						</div>
					</div>
				</div>
			</div>
			<div v-if="commentsStats.total !== 0" class="border-b w-full"></div>
			<!-- Comment Emotions -->
			<div v-if="commentsStats.total !== 0" class="pt-5">
				<h6 class="w-full pb-4 text-center text-sm font-semibold dark:text-darkPrimaryText">Comment Emotions</h6>
				<!-- Row of faces -->
				<div class="flex items-center">
					<button
						v-show="page > 0"
						class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full"
						@click="page = page - 1"
					>
						<ChevronLeft />
					</button>
					<div class="grid w-full grid-cols-3 lg:grid-cols-6">
						<div v-for="f in faceStats.slice(page * 6, page * 6 + 6)" :key="f.face.label" class="flex w-24 flex-col">
							<div class="flex flex-col rounded-lg border p-1" :class="`border-` + getStyle(f.face.label)">
								<span class="self-center text-xs dark:text-darkPrimaryText">{{ f.face.label.replace(/_/g, ' ') }}</span>
								<img
									:src="$colorMode.dark ? f.face.dark : f.face.light"
									:alt="f.face.label"
									class="h-16 w-16 self-center mt-1"
								/>
							</div>
							<span class="mt-1 self-center text-sm font-semibold dark:text-darkPrimaryText"
								>{{ ((f.count / commentsStats.total) * 100).toFixed(1) }}%</span
							>
						</div>
					</div>
					<button
						v-show="6 * page + 6 < faceStats.length"
						class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full"
						@click="page = page + 1"
					>
						<ChevronRight />
					</button>
				</div>
			</div>
		</article>
		<!-- Show reposters -->
		<article v-show="toggleReposters" class="pt-5 modal-animation">
			<!-- Back button -->
			<div class="flex items-center">
				<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full" @click="closeReposters">
					<ChevronLeft />
				</button>
				<span class="pl-2 text-sm font-semibold dark:text-darkPrimaryText" style="margin-bottom: 2px">All stats</span>
			</div>
			<div v-for="p in profiles" :key="p.id">
				<ProfilePreview :profile="p" :updateFollowers="updateFollowers" class="pt-4" />
			</div>
		</article>
		<!-- Post a Comment -->
		<article v-show="!toggleStats && !toggleReposters" id="section" class="modal-animation">
			<div class="flex w-full justify-between py-5">
				<div class="flex flex-row items-center">
					<span class="pr-2 font-semibold dark:text-darkPrimaryText"
						>{{ commentsStats.total }} {{ commentsStats.total === 1 ? 'comment' : 'comments' }}</span
					>
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
					class="z-10 mr-1 hidden lg:flex flex-row justify-between rounded-tr-lg bg-lightBG dark:bg-darkBG p-5 lg:w-3/5"
					style="margin-bottom: -112px; margin-top: 1px; pointer-events: none"
				>
					<h6 class="text-lightPrimaryText dark:text-darkPrimaryText self-center text-center text-2xl font-semibold">
						How do you feel?
					</h6>
				</div>
				<div class="absolute z-20 mt-8 lg:mt-10 mr-8 flex items-center">
					<button
						class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1"
						@click="
							showEmotions = false
							selectedEmotionColor = `neutralLightest`
							selectedEmotion = { label: ``, light: null, dark: null }
						"
					>
						<CloseIcon />
					</button>
				</div>
				<div
					class="z-10 flex flex-row justify-between rounded-tl-lg bg-gradient-to-b from-lightBG dark:from-darkBG to-transparent p-5 w-full lg:w-2/5 mr-1 lg:mr-0"
					style="margin-bottom: -112px; pointer-events: none; margin-top: 1px; margin-left: 1px"
				></div>
			</div>
			<div class="flex flex-col items-start lg:flex-row">
				<!-- Comment box Container -->
				<div
					v-show="!showEmotions"
					class="mr-4 hidden items-start justify-between lg:flex"
					style="width: 60px; height: 60px"
				>
					<Avatar
						:avatar="$store.state.session.id === `` ? require(`@/assets/images/avatars/unauthenticated.webp`) : avatar"
						:authorID="$store.state.session.id"
						class="flex-shrink-0 mx-2"
						:class="`border-` + selectedEmotionColor"
						:noClick="true"
						:size="`h-12 w-12`"
					/>
				</div>
				<div
					id="faceSelector"
					class="border-lightBorder flex w-full overflow-hidden rounded-xl border"
					:class="
						showEmotions
							? ``
							: (selectedEmotionColor === `positive` ||
									selectedEmotionColor === `neutral` ||
									selectedEmotionColor === `negative`) &&
							  selectedEmotion.label !== ``
							? `border p-2 bg-` + selectedEmotionColor
							: `p-2 bg-lightBG dark:bg-darkBG`
					"
				>
					<div
						class="flex w-full items-center justify-center overflow-hidden rounded-xl relative"
						:style="showEmotions ? `height: 20rem` : `height: 10rem`"
					>
						<div v-if="this.$store.state.session.id !== ``" class="flex w-full flex-row">
							<!-- Front side: Type comment -->
							<div v-show="!showEmotions" class="flex w-full bg-lightBG dark:bg-darkBG">
								<button class="focus:outline-none h-auto flex-shrink-0" @click="toggleShowEmotions">
									<span v-if="activeEmotion.label !== ``">
										<img
											:src="$colorMode.dark ? activeEmotion.dark : activeEmotion.light"
											:alt="activeEmotion.label"
											class="object-contain w-24 h-24 lg:w-32 lg:h-32"
											style="transform: rotateY(180deg)"
										/>
									</span>
									<span v-else>
										<img
											:src="
												$colorMode.dark
													? require(`@/assets/images/reactions/dark/confident.webp`)
													: require(`@/assets/images/reactions/light/confident.webp`)
											"
											:alt="`select an emotion`"
											class="transition duration-500 ease-in-out opacity-50 hover:opacity-100 w-24 h-24 lg:w-32 lg:h-32"
											style="transform: rotateY(180deg)"
									/></span>
								</button>
								<textarea
									v-if="comments.length > 0"
									v-model="comment"
									class="focus:outline-none placeholder-gray5 dark:placeholder-gray3 dark:text-darkPrimaryText mr-6 h-40 w-full resize-none overflow-y-auto py-4 pl-2 pr-10 lg:pr-16 leading-normal bg-transparent"
									name="body"
									placeholder="What's your response?"
								/>
								<textarea
									v-else
									v-model="comment"
									class="focus:outline-none placeholder-gray5 dark:placeholder-gray3 dark:text-darkPrimaryText mr-6 h-40 w-full resize-none overflow-y-auto py-4 pl-2 pr-10 lg:pr-16 leading-normal bg-transparent"
									name="body"
									placeholder="Be the first one to comment on this post..."
								/>
								<div class="relative">
									<span class="absolute bottom-0 right-0 flex flex-col">
										<button
											class="bg-primary focus:outline-none block rounded-lg lg:hidden"
											style="margin-right: 15.2px; margin-bottom: 15px"
											:class="comment !== '' && activeEmotion.label !== '' ? '' : 'opacity-50'"
											@click="sendComment"
										>
											<SendIcon class="m-2 mb-3 ml-3 h-5 w-5 text-white transform rotate-45" />
										</button>
										<BrandedButton
											style="margin-right: 15.2px; margin-bottom: 15px"
											text="Post"
											class="hidden lg:block"
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
								class="modal-animation w-full overflow-y-scroll bg-lightBG dark:bg-darkBG px-4 lg:px-6 flex justify-center"
								style="height: 320px; scroll-snap-type: y mandatory; scroll-snap-stop: always"
							>
								<!-- Middle selector area -->
								<div
									class="absolute rounded-lg p-2 h-32 lg:h-24 mt-24 lg:mt-28"
									:class="
										selectedEmotionColor === `positive` ||
										selectedEmotionColor === `neutral` ||
										selectedEmotionColor === `negative`
											? `bg-opacity-25 bg-` + selectedEmotionColor
											: `bg-gray1 dark:bg-gray7`
									"
									style="width: 92%"
								></div>
								<!-- Faces grid -->
								<div class="relative w-full" style="padding-bottom: 120px; padding-top: 120px">
									<div
										v-for="row in faceGroupings"
										:key="row[0].label + row[1].label + row[2].label"
										class="relative flex w-full flex-row mb-2 lg:px-2 justify-between"
										style="scroll-snap-align: center"
									>
										<button
											v-for="face in row"
											:key="face.label"
											class="focus:outline-none outline-none rounded-lg border-2 border-transparent"
											:class="selectedEmotion.label === face.label ? `border-2 border-` + selectedEmotionColor : ``"
											style="transition: all 0.3s ease-in-out"
											@click="setEmotion($event, face)"
										>
											<img
												:src="$colorMode.dark ? face.dark : face.light"
												:alt="face.label"
												class="h-20 w-20"
												style="transform: rotateY(180deg)"
											/>
											<p
												class="capitalize lg:hidden mt-1"
												:class="
													selectedEmotion.label === face.label
														? `font-bold text-` + selectedEmotionColor
														: `text-gray7 dark:text-gray3`
												"
											>
												{{ face.label.replace(/_/g, ' ') }}
											</p>
										</button>
										<div
											v-for="face in row"
											:key="face.label + face.label"
											class="face-tag hidden lg:flex flex-grow items-center justify-center"
										>
											<button
												class="focus:outline-none outline-none flex flex-grow items-center justify-center"
												:class="
													selectedEmotion.label === face.label
														? `font-bold text-` + selectedEmotionColor
														: `text-gray7 dark:text-gray3`
												"
												style="transition: all 0.3s ease-in-out"
												@click="setEmotion($event, face)"
											>
												<p class="capitalize">
													{{ face.label.replace(/_/g, ' ') }}
												</p>
											</button>
											<div class="bg-gray5 dark:bg-darkBG separator h-1 w-1 rounded-full"></div>
										</div>
									</div>
									<!-- Extra row for spacing -->
									<div class="w-full" style="height: 120px"></div>
								</div>
							</div>
						</div>
						<div v-else class="text-gray5 dark:text-gray3 pt-3 text-sm">
							<button class="text-primary focus:outline-none ml-1" @click="$router.push(`/register`)">Sign up</button>
							to comment on this post and be part of the debate
						</div>
					</div>
				</div>
			</div>
			<!-- Bottom overlay with selector -->
			<div v-show="showEmotions" class="relative flex w-full flex-row-reverse">
				<div
					class="z-10 mr-1 hidden lg:flex flex-row-reverse items-end rounded-br-xl bg-lightBG dark:bg-darkBG p-5 lg:w-3/5"
					style="height: 111px; margin-top: -112px; margin-left: 10px; margin-bottom: 1px; pointer-events: none"
				></div>
				<button
					class="bg-primary focus:outline-none absolute bottom-0 right-0 z-20 mb-7 mr-7 rounded-lg px-6 py-2 text-white"
					@click="confirmEmotion"
				>
					Select
				</button>
				<div
					class="z-10 bg-gradient-to-t from-lightBG dark:from-darkBG to-transparent flex flex-row-reverse items-end rounded-bl-lg p-5 w-full mr-1 lg:mr-0 lg:w-80"
					style="height: 111px; margin-top: -112px; pointer-events: none; margin-bottom: 1px; margin-left: 1px"
				></div>
			</div>
			<Comment
				v-for="c in comments"
				:key="c._id"
				class="py-2"
				:parentCID="postCID"
				:authorID="c.authorID"
				:postAuthor="postAuthor"
				:cid="c._id"
				:timestamp="c.timestamp"
				@updateComments="initComments()"
			/>
			<div v-if="comments.length === 0 && filter !== ``" class="text-gray5 dark:text-gray3 pt-5 text-sm text-center">
				No comments under this filter
			</div>
			<div
				v-if="noMoreComments && comments.length > 0"
				class="text-gray5 dark:text-gray3 text-sm text-center"
				:class="$route.name === `post-post` ? `py-5` : `pt-5`"
			>
				End of comments
			</div>
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import sortBy from 'lodash/sortBy'
import BrandedButton from '@/components/BrandedButton.vue'
import Comment from '@/components/post/Comment.vue'
import CommentFilter from '@/components/post/CommentFilter.vue'
import SendIcon from '@/components/icons/Send.vue'
import CloseIcon from '@/components/icons/X.vue'
import StatsIcon from '@/components/icons/Stats.vue'
import ChevronLeft from '@/components/icons/ChevronLeft.vue'
import ChevronRight from '@/components/icons/ChevronRight.vue'
import Avatar from '@/components/Avatar.vue'

import { feelings } from '@/config/config'
import { faces, faceGroupings, IFace } from '@/config/faces'
import {
	createComment,
	sendComment,
	ICommentData,
	getCommentsOfPost,
	getCommentsStats,
	ICommentsStats,
} from '@/backend/comment'
import { getReposters, IGetRepostsOptions } from '@/backend/reposts'
import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import { getFollowersAndFollowing } from '@/backend/following'
import { getPhotoFromIPFS } from '@/backend/getPhoto'

interface FaceStat {
	face: IFace
	count: number
}

interface IData {
	faceGroupings: Array<[IFace, IFace, IFace]>
	feelingList: { negative: Set<string>; positive: Set<string>; neutral: Set<string> }
	activeEmotion: IFace
	selectedEmotion: IFace
	comments: ICommentData[]
	avatar: string
	comment: string
	emotion: string
	showEmotions: boolean
	filter: string
	showDropdown: boolean
	toggleStats: boolean
	toggleReposters: boolean
	reposters: Array<string>
	profiles: Array<Profile>
	followers: Set<string>
	following: Set<string>
	userIsFollowed: boolean
	faceStats: FaceStat[]
	page: number
	selectedEmotionColor: `positive` | `neutral` | `negative` | `neutralLightest`
	sendingComment: boolean
	currentCommentsOffset: number
	commentsLimit: number
	isLoading: boolean
	noMoreComments: boolean
	commentsStats: ICommentsStats
}

export default Vue.extend({
	name: `ComponentPostActions`,
	components: {
		BrandedButton,
		Comment,
		Avatar,
		CommentFilter,
		CloseIcon,
		StatsIcon,
		ChevronLeft,
		ChevronRight,
		SendIcon,
	},
	props: {
		postCID: {
			type: String,
			required: true,
		},
		postAuthor: {
			type: String,
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
			activeEmotion: { label: ``, light: null, dark: null },
			selectedEmotion: { label: ``, light: null, dark: null },
			comment: ``,
			comments: [],
			emotion: ``,
			showEmotions: false,
			filter: ``,
			showDropdown: false,
			toggleStats: this.openStats,
			toggleReposters: false,
			reposters: [],
			profiles: [],
			followers: new Set(),
			following: new Set(),
			userIsFollowed: false,
			faceStats: [],
			page: 0,
			selectedEmotionColor: `neutralLightest`,
			sendingComment: false,
			currentCommentsOffset: 0,
			commentsLimit: 10,
			isLoading: true,
			noMoreComments: false,
			commentsStats: {
				total: 0,
				positive: 0,
				neutral: 0,
				negative: 0,
				faceStats: {},
			},
		}
	},
	created() {
		this.initComments()
		this.initReposters()
		this.isLoading = false
	},
	mounted() {
		this.addScrollHandler()
	},
	methods: {
		addScrollHandler() {
			// comment pagination event handler
			if (this.$route.name !== `post-post`) {
				// Post card popup eventhandler
				const postActions = this.$refs.postActions as HTMLElement
				postActions.parentElement?.addEventListener(`scroll`, this.handleScroll)
				return
			}
			// Full page event handler
			const postActions = document.getElementById(`post`) as HTMLElement
			postActions.addEventListener(`scroll`, this.handleScroll)
		},
		async initComments() {
			this.comments = await getCommentsOfPost(this.postCID, this.currentCommentsOffset, this.commentsLimit)
			if (this.comments.length < 10) {
				this.noMoreComments = true
				this.removeScrollListener()
			}
			this.currentCommentsOffset += this.commentsLimit
			// get comment stats
			await this.updateCommentsStats()
			if (this.$store.state.session.avatar !== ``) {
				getPhotoFromIPFS(this.$store.state.session.avatar).then((a) => {
					this.avatar = a
				})
			}
		},
		async updateCommentsStats() {
			this.commentsStats = await getCommentsStats(this.postCID)
			const { faceStats } = this.commentsStats
			const stats: Record<string, FaceStat> = {}

			for (const face in faceStats) {
				if (!(face in faces)) {
					continue
				}
				const f = faces[face]
				stats[f.label] = { face: f, count: faceStats[face] }
			}
			this.faceStats = sortBy(Object.values(stats), `count`)
		},
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
			this.currentCommentsOffset = 0
			this.comments = []
			this.noMoreComments = false
			this.addScrollHandler()
			this.filterComments()
		},
		setEmotion(e: PointerEvent, r: { label: string; light: any; dark: any }) {
			if (!e.target) {
				return
			}
			const target = e.target as HTMLElement
			target.scrollIntoView({ behavior: `smooth`, block: `center` })
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
				this.$toastError(`You must select a reaction before posting`)
				return
			}
			this.comment = this.comment.trim()
			const commentQualityCheck = this.$qualityComment(this.comment)
			if (this.$isError(commentQualityCheck)) {
				this.$toastError(commentQualityCheck.error)
				return
			}
			// prevent duplicates
			if (this.sendingComment) {
				return
			}
			this.sendingComment = true
			// Send comment (c)
			try {
				const c = createComment(this.$store.state.session.id, this.comment, this.activeEmotion.label, this.postCID)
				const _id = await sendComment(c, `comment`)
				this.comments.unshift({ _id, ...c })
				this.comment = ``
				this.selectedEmotion = { label: ``, light: null, dark: null }
				this.activeEmotion = { label: ``, light: null, dark: null }
				this.emotion = ``
				this.filter = ``
				this.selectedEmotionColor = `neutralLightest`
				this.updateCommentsStats()
				this.sendingComment = false
			} catch (err: unknown) {
				this.$handleError(err)
			}
		},
		async filterComments() {
			if (this.isLoading) {
				return
			}
			let moreComments: ICommentData[] = []
			this.isLoading = true
			try {
				// Fetch comments
				if (this.filter === ``) {
					moreComments = await getCommentsOfPost(this.postCID, this.currentCommentsOffset, this.commentsLimit)
				} else if (this.filter === `positive` || this.filter === `neutral` || this.filter === `negative`) {
					// Get a list of comments with multiple emotions under the same category
					moreComments = await getCommentsOfPost(
						this.postCID,
						this.currentCommentsOffset,
						this.commentsLimit,
						undefined,
						this.filter,
					)
					return
				} else {
					// Get a list of comments with a specific emotion
					moreComments = await getCommentsOfPost(
						this.postCID,
						this.currentCommentsOffset,
						this.commentsLimit,
						this.filter.charAt(0).toLowerCase() + this.filter.replace(/\s/g, ``).substring(1),
					)
				}
			} catch (err) {
				this.isLoading = false
			} finally {
				this.comments = this.comments.concat(moreComments)
				this.isLoading = false
				if (moreComments.length < 10) {
					this.noMoreComments = true
					this.removeScrollListener()
				} else {
					this.currentCommentsOffset += this.commentsLimit
				}
			}
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
		openReposters() {
			// this.toggleStats = false
			// this.toggleReposters = true
			this.$emit(`reposters`)
		},
		closeReposters() {
			this.toggleStats = true
			this.toggleReposters = false
		},
		async initReposters() {
			const options: IGetRepostsOptions = { sort: `NEW`, offset: 0, limit: 1000 }
			this.reposters = await getReposters(this.postCID, options)
			this.reposters.forEach(this.getFollowers)
		},
		async getFollowers(p: string) {
			let profile = createDefaultProfile(p)
			const fetchedProfile = await getProfile(p)
			if (fetchedProfile.profile) {
				profile = fetchedProfile.profile
			}
			this.profiles.push(profile)
		},
		async updateFollowers() {
			const { followers, following } = await getFollowersAndFollowing(this.$route.params.id, true)
			this.followers = followers
			this.following = following
			this.userIsFollowed = followers.has(this.$store.state.session.id)
		},
		handleScroll(e: Event) {
			const { scrollTop, scrollHeight, clientHeight } = e.srcElement as HTMLElement
			if (scrollTop + clientHeight >= scrollHeight - 5) {
				if (!this.isLoading && !this.noMoreComments) {
					this.filterComments()
				}
			}
		},
		removeScrollListener() {
			const postActions = this.$refs.postActions as HTMLElement
			postActions.parentElement?.removeEventListener(`scroll`, this.handleScroll)
		},
	},
})
</script>

<style>
.face-tag:last-child .separator {
	display: none;
}
</style>
