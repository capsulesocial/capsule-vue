<template>
	<section>
		<!-- Post a Comment -->
		<article class="py-5">
			<!-- Bottom overlay with selector -->
			<div v-show="showEmotions" class="w-full flex flex-row-reverse">
				<div class="h-24 -mb-24 z-10 bg-white flex flex-row justify-between p-5" style="width: 450px">
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
				<div
					class="flex shadow-xl rounded-xl w-full overflow-hidden"
					:class="showEmotions ? `` : `border p-4 bg-` + emotionCategory"
				>
					<div class="rounded-xl overflow-hidden w-full" :style="showEmotions ? `height: 20rem` : `height: 10rem`">
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
							<div
								v-show="showEmotions"
								ref="scrollContainer"
								class="w-full overflow-y-auto bg-white"
								style="height: 20rem; box-shadow: rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset"
							>
								<!-- Middle selector area -->
								<div class="h-24 absolute rounded-lg bg-primary bg-opacity-25 mt-24" style="width: 760px"></div>
								<!-- Faces grid -->
								<div class="pt-24" style="padding-bottom: 128px">
									<div
										v-for="row in faceGroupings"
										:key="row[0].label + row[1].label + row[2].label"
										class="flex flex-row w-full relative"
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
					style="width: 450px; height: 128px; margin-top: -128px"
				>
					<button class="rounded-lg bg-primary text-white px-6 py-2 focus:outline-none" @click="confirmEmotion">
						Select
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
import CloseIcon from '@/components/icons/X.vue'

import { backgrounds, reactions, feelings, faces, faceGroupings } from '@/config'
import { createComment, sendComment, ICommentData, getCommentsOfPost } from '@/backend/comment'

interface IData {
	backgroundList: Record<string, string>
	reactionList: Record<string, any>
	facesList: Record<string, any>
	faceGroupings: object[]
	feelingList: Record<string, any>
	activeEmotion: { label: string; leftImage: any; rightImage: any }
	selectedEmotion: { label: string; leftImage: any; rightImage: any }
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
		CloseIcon,
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
			selectedEmotion: { label: ``, leftImage: null, rightImage: null },
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
	mounted() {
		const scroller = this.$refs.scrollContainer as HTMLElement
		scroller.addEventListener(`scroll`, this.handleScrollContainer)
	},
	methods: {
		handleScrollContainer(e: Event): void {
			if (e.target) {
				const { scrollTop, scrollHeight } = e.srcElement as HTMLElement
				// eslint-disable-next-line no-console
				console.log(`scrollTop`, scrollTop)
				// eslint-disable-next-line no-console
				console.log(`scrollHeight`, scrollHeight)
			}
		},
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
