<template>
	<div v-show="!commentDeleted" class="object-contain">
		<!-- Component that displays a posted comment -->
		<div class="mt-2 flex w-full">
			<!-- Desktop avatar -->
			<div class="mr-4 hidden items-start justify-between lg:flex">
				<span class="flex-shrink-0 rounded-lg px-1 pt-1" :style="getStyle(`bg-`)">
					<Avatar
						:avatar="avatar"
						:authorID="authorID"
						size="w-12 h-12"
						style="margin-top: 2px; margin-left: 2px; margin-right: 2px"
					/>
				</span>
			</div>
			<!-- Dashed bubble -->
			<div
				class="relative flex flex-row w-full overflow-x-auto justify-between rounded-lg border border-dashed"
				:style="getStyle(`border-`)"
			>
				<!-- Text -->
				<div class="flex w-full flex-grow flex-col px-3 py-1 pt-2">
					<!-- Top row: name, id, timestamp -->
					<div class="flex items-center flex-wrap">
						<nuxt-link :to="`/id/` + authorID" class="mr-4 flex items-center lg:mb-0 mb-2">
							<Avatar :avatar="avatar" :authorID="authorID" size="w-8 h-8" class="mr-2 flex-shrink-0 lg:hidden" />
							<span v-if="name != ``" class="font-medium dark:text-darkPrimaryText">
								{{ name }}
							</span>
							<span v-else class="text-gray5 dark:text-gray3 font-medium">{{ authorID }}</span>
							<span class="text-lightPrimaryText dark:text-darkPrimaryText ml-2 text-sm lg:text-base">
								@{{ authorID }}
							</span>
							<span
								v-if="authorID === postAuthor"
								class="bg-gray1 dark:bg-lightBG dark:text-darkPrimaryText ml-2 rounded-2xl dark:bg-opacity-25 py-1 px-2 text-xs"
							>
								Author
							</span>
						</nuxt-link>
						<span v-if="timestamp" class="self-center text-xs dark:text-gray3 mb-2 lg:mt-2">
							{{ $formatDate(timestamp) }}
						</span>
					</div>
					<!-- Content -->
					<div class="flex">
						<div class="flex flex-grow flex-col overflow-hidden">
							<div class="w-full">
								<!-- Reaction face image -->
								<div class="flex float-right flex-shrink-0 items-center justify-center overflow-hidden">
									<img
										:src="$colorMode.dark ? emotion.dark : emotion.light"
										class="-mb-1 mt-2 h-32 w-32 bg-transparent"
										:class="emotion.label === `default` ? `animate-pulse` : ``"
										:style="emotion.label === `default` ? `filter: blur(5px)` : ``"
										@mouseover="showLabel = true"
										@mouseleave="showLabel = false"
									/>
									<div
										v-show="showLabel"
										class="border-lightBorder modal-animation-delay absolute top-0 mt-2 z-40 flex flex-col rounded-lg border bg-lightBG dark:bg-darkBG p-2 shadow-lg"
									>
										<p class="text-sm text-gray5 dark:text-gray3">
											{{ emotion.label.replace(/_/g, ' ') }}
										</p>
									</div>
								</div>
								<!-- Text comment -->
								<p class="break-words w-4/5 py-1 mb-6 font-sans leading-relaxed dark:text-darkPrimaryText">
									<span style="white-space: pre-line">{{ content }}</span>
								</p>

								<!-- Reply button -->
								<div class="flex flex-row items-center absolute bottom-0 pb-2">
									<button
										class="text-primary focus:outline-none text-left font-sans text-sm"
										@click="isReplying = !isReplying"
									>
										Reply
									</button>
									<p
										v-if="replies.length === 1"
										class="text-gray5 dark:text-gray3 focus:outline-none text-left font-sans text-sm ml-4 cursor-pointer"
										@click="isReplying = !isReplying"
									>
										{{ replies.length }} Reply
									</p>
									<p
										v-else
										class="text-gray5 dark:text-gray3 focus:outline-none text-left font-sans text-sm ml-4 cursor-pointer"
										@click="isReplying = !isReplying"
									>
										{{ replies.length }} Replies
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- Remove post -->
				<!-- <button v-if="this.$store.state.session.id === authorID" @click="removeComment">
					<BinIcon />
				</button> -->
				<button
					v-if="this.$store.state.session.id === authorID || this.$store.state.session.id === postAuthor"
					class="focus:outline-none absolute top-0 right-0 flex-col justify-start text-gray5 dark:text-gray3 pt-2 pr-3"
					@click.stop="toggleDropdownDelete"
				>
					<More />
				</button>
				<div
					v-show="showDelete"
					class="border-lightBorder modal-animation absolute z-10 flex w-44 flex-col items-center rounded-lg border bg-lightBG dark:bg-darkBG p-1 shadow-lg"
					:class="$colorMode.dark ? `dropdownDeleteOpenDark` : `dropdownDeleteOpen`"
					style="top: 40px; right: 0px"
				>
					<!-- Delete -->
					<button class="focus:outline-none text-negative flex" @click="removeComment">
						<BinIcon class="p-1" />
						<span class="text-negative self-center text-xs ml-1 mr-1">Remove this comment</span>
					</button>
				</div>
			</div>
		</div>
		<p v-if="$route.name === `id-id-comments`" class="mt-1 text-right">
			<nuxt-link :to="`/post/` + parentCID" class="text-gray5 dark:text-gray3 text-xs">View Post</nuxt-link>
		</p>
		<!-- Reply button -->
		<div class="ml-3 pl-1 lg:ml-20">
			<!-- Active reply state -->
			<div v-if="isReplying" class="modal-animation mr-5 mt-4 border-l border-gray5 pl-2">
				<!-- Reply Input box -->
				<div
					v-if="$store.state.session.id !== ``"
					class="ml-5 flex w-full rounded-xl border-2 p-1 bg-lightBG dark:bg-darkBG text-lightPrimaryText dark:text-darkPrimaryText border-lightBorder"
				>
					<textarea
						v-model="reply"
						rows="4"
						type="text"
						placeholder="Reply.."
						class="focus:outline-none w-4/5 overflow-hidden py-1 px-2 text-sm leading-normal bg-lightBG dark:bg-darkBG text-lightPrimaryText dark:text-darkPrimaryText"
						style="resize: none"
						:style="`height:` + replyInputHeight + `px`"
						@keydown="handleResize"
					>
					</textarea>
					<span class="relative w-1/5 flex justify-end items-end">
						<button
							v-if="reply !== ''"
							class="text-primary focus:outline-none text-left font-sans text-sm p-4"
							@click="sendReply"
						>
							Post reply
						</button>
					</span>
				</div>
				<div v-else class="text-gray5 dark:text-gray3 p-4 text-sm bg-lightBG dark:bg-darkBG rounded-lg mb-4">
					<button class="text-primary focus:outline-none ml-1" @click="$router.push(`/register`)">Sign up</button>
					to reply to this comment and be part of the debate
				</div>
				<!-- List replies -->
				<div v-if="filterReplies().length > 0" class="pl-5 mt-2">
					<Reply
						v-for="r in filterReplies()"
						:key="r._id"
						:commenterID="authorID"
						:authorID="r.authorID"
						:cid="r._id"
						:timestamp="r.timestamp"
						class="pt-1 mt-2"
						@updateReplies="fetchReplies"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import Avatar from '@/components/Avatar.vue'
import Reply from '@/components/post/Reply.vue'
import More from '@/components/icons/More.vue'
import BinIcon from '@/components/icons/Bin.vue'

import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import { feelings } from '@/config/config'
import { faces, IFace } from '@/config/faces'
import { createComment, getComment, getCommentsOfPost, ICommentData, sendComment } from '@/backend/comment'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import { getProfileFromSession } from '@/store/session'
import { sendPostDeletion } from '@/backend/postDeletion'

interface IData {
	isReplying: boolean
	reply: string
	replies: ICommentData[]
	avatar: string
	name: string
	emotion: IFace
	emotionType: string
	content: string
	showLabel: boolean
	commentDeleted: boolean
	showDelete: boolean
	currentRepliesOffset: number
	repliesLimit: number
	replyInputHeight: number
}

export default Vue.extend({
	name: `Comment`,
	components: {
		Reply,
		Avatar,
		More,
		BinIcon,
	},
	props: {
		authorID: { type: String, required: true },
		postAuthor: {
			type: String,
			default: ``,
		},
		cid: { type: String, required: true },
		timestamp: { type: Number, required: true },
		parentCID: { type: String, required: true },
		profile: { type: Object as PropType<Profile>, default: null },
	},
	data(): IData {
		return {
			isReplying: false,
			reply: ``,
			replies: [],
			avatar: ``,
			name: ``,
			emotion: faces.default,
			emotionType: ``,
			content: ``,
			showLabel: false,
			commentDeleted: false,
			showDelete: false,
			currentRepliesOffset: 0,
			repliesLimit: 10,
			replyInputHeight: 64,
		}
	},
	async created() {
		const comment = await getComment(this.cid)
		this.content = comment.content
		this.emotionType = comment.emotion
		const reaction = comment.emotion as keyof typeof faces
		if (reaction in faces) {
			this.emotion = faces[reaction]
			return
		}
		this.emotion = faces.default
	},
	async mounted() {
		let p = this.profile
		if (!p) {
			if (this.$store.state.session.id === this.authorID) {
				// Viewing own post
				p = getProfileFromSession(this.$store.state.session)
			} else {
				// Viewing someone else's post
				p = createDefaultProfile(this.authorID)
				const { profile } = await getProfile(this.authorID)
				if (profile) {
					p = profile
				}
			}
		}
		this.name = p.name
		if (p.avatar) {
			getPhotoFromIPFS(p.avatar).then((a) => {
				this.avatar = a
			})
		}
		// Fetch replies
		await this.fetchReplies()
		// Close more dropdown
		window.addEventListener(`click`, () => {
			if (this.showDelete) {
				this.showDelete = false
			}
		})
	},
	methods: {
		getStyle(prefix: string) {
			let res: string = ``
			if (prefix === `border-`) {
				res = `border-color: `
			} else if (prefix === `bg-`) {
				res = `background-color: `
			}
			if (feelings.positive.has(this.emotionType)) {
				res += `#1F7DAD`
			} else if (feelings.negative.has(this.emotionType)) {
				res += `#EE1F63`
			} else {
				res += `#F0B785`
			}
			return res
		},
		async sendReply() {
			this.reply = this.reply.trim()
			const replyQualityCheck = this.$qualityComment(this.reply)
			if (this.$isError(replyQualityCheck)) {
				this.$toastError(replyQualityCheck.error)
				return
			}
			try {
				const c = createComment(this.$store.state.session.id, this.reply, `no-emotion`, this.cid)
				const _id = await sendComment(c, `reply`)
				this.replies.push({ _id, ...c })
				this.filterReplies()
				this.reply = ``
			} catch (err: unknown) {
				this.$handleError(err)
			}
		},
		filterReplies(): ICommentData[] {
			return this.replies.slice().sort((p0, p1) => p1.timestamp - p0.timestamp)
		},
		async removeComment() {
			try {
				await sendPostDeletion(`HIDE`, this.cid, this.$store.state.session.id)
				this.commentDeleted = true
				this.$emit(`updateComments`)
				this.$toastSuccess(`This comment has been successfully removed`)
			} catch (err: unknown) {
				this.$handleError(err)
			}
		},
		toggleDropdownDelete() {
			this.showDelete = !this.showDelete
		},
		async fetchReplies() {
			this.replies = await getCommentsOfPost(this.cid, this.currentRepliesOffset, this.repliesLimit)
		},
		handleResize(e: any) {
			if (e.srcElement.clientHeight !== e.srcElement.scrollHeight) {
				this.replyInputHeight = e.srcElement.scrollHeight
			}
		},
	},
})
</script>

<style scoped>
.tooltip .tooltiptext {
	visibility: hidden;
	/* Position the tooltip */
	position: absolute;
	z-index: 1;
}

.tooltip:hover .tooltiptext {
	visibility: visible;
	top: 100%;
	left: 50%;
}
</style>
