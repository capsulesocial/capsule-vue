<template>
	<div v-show="!commentDeleted" class="object-contain">
		<!-- Component that displays a posted comment -->
		<div class="mt-2 flex w-full">
			<!-- Desktop avatar -->
			<div class="mr-4 hidden items-start justify-between xl:flex">
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
				class="flex flex-row w-full overflow-x-auto justify-between rounded-lg border border-dashed"
				:style="getStyle(`border-`)"
				style="backdrop-filter: blur(10px)"
			>
				<!-- Text -->
				<div class="flex w-full flex-grow flex-col px-3 py-1 pt-3">
					<!-- Top row: name, id, timestamp -->
					<div class="flex items-center flex-wrap mb-2">
						<nuxt-link :to="`/id/` + authorID" class="mr-4 flex items-center xl:mb-0">
							<Avatar :avatar="avatar" :authorID="authorID" size="w-8 h-8" class="mr-2 flex-shrink-0 xl:hidden" />
							<span v-if="name != ``" class="font-medium dark:text-darkPrimaryText">
								{{ name }}
							</span>
							<span v-else class="text-gray5 dark:text-gray3 font-medium">{{ authorID }}</span>
							<span class="text-primary dark:text-secondary ml-2 text-sm xl:text-base"> @{{ authorID }} </span>
							<span
								v-if="authorID === postAuthor"
								class="bg-primary dark:bg-secondary dark:text-darkPrimaryText ml-2 rounded-2xl bg-opacity-25 py-1 px-2 text-xs"
							>
								Author
							</span>
						</nuxt-link>
						<span v-if="timestamp" class="self-center text-xs dark:text-gray3">
							{{ $formatDate(timestamp) }}
						</span>
					</div>
					<!-- Content -->
					<div class="flex">
						<div class="flex flex-grow flex-col overflow-hidden">
							<div class="w-full">
								<!-- Reaction face image -->
								<div class="flex inline float-right flex-shrink-0 items-center justify-center overflow-hidden">
									<img
										:src="dark ? emotion.dark : emotion.light"
										class="-mb-1 mt-2 h-32 w-32 bg-transparent"
										:class="emotion.label === `default` ? `animate-pulse` : ``"
										:style="emotion.label === `default` ? `filter: blur(5px)` : ``"
										@mouseover="showLabel = true"
										@mouseleave="showLabel = false"
									/>
									<div
										v-show="showLabel"
										class="border-lightBorder modal-animation-delay absolute z-40 flex flex-col rounded-lg border bg-lightBG dark:bg-darkBG p-2 shadow-lg"
										style="bottom: -25px"
									>
										<p class="text-sm text-gray5 dark:text-gray3">
											{{ emotion.label }}
										</p>
									</div>
								</div>
								<!-- Text comment -->
								<p class="break-words py-1 mb-6 font-sans text-lg leading-relaxed dark:text-darkPrimaryText">
									{{ content }}
								</p>

								<!-- Reply button -->
								<div class="flex flex-row items-center absolute bottom-0 pb-2">
									<button
										class="text-primary dark:text-secondary focus:outline-none text-left font-sans text-sm"
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
					class="focus:outline-none absolute top-0 right-0 flex-col justify-start text-gray5 dark:text-gray3 pt-4 pr-2"
					@click.stop="toggleDropdownDelete"
				>
					<More />
				</button>
				<div
					v-show="showDelete"
					class="border-lightBorder modal-animation absolute z-10 flex w-44 flex-col items-center rounded-lg border bg-lightBG dark:bg-darkBG p-1 shadow-lg"
					:class="dark ? `dropdownDeleteOpenDark` : `dropdownDeleteOpen`"
					style="top: 37px; right: -2px"
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
		<div class="ml-3 pl-1 xl:ml-20">
			<!-- Active reply state -->
			<div v-if="isReplying" class="modal-animation mr-5 mt-4 border-l border-gray5 pl-2">
				<!-- Reply Input box -->
				<div
					v-if="$store.state.session.id !== ``"
					class="ml-5 flex w-full rounded-xl border-2 p-1 bg-lightBG dark:bg-darkBG text-lightPrimaryText dark:text-darkPrimaryText border-lightBorder"
				>
					<textarea
						v-model="reply"
						type="text"
						placeholder="Reply.."
						class="resize-vertical focus:outline-none w-4/5 overflow-y-auto py-1 px-2 text-sm leading-normal bg-lightBG dark:bg-darkBG text-lightPrimaryText dark:text-darkPrimaryText"
						style="resize: none"
					>
					</textarea>
					<span class="relative w-1/5 flex justify-end items-end">
						<button
							v-if="reply !== ''"
							class="text-primary dark:text-secondary focus:outline-none text-left font-sans text-sm p-4"
							@click="sendReply"
						>
							Post reply
						</button>
					</span>
				</div>
				<!-- List replies -->
				<div v-if="filterReplies().length > 0" class="pl-5 mt-2">
					<Reply
						v-for="r in filterReplies()"
						:key="r._id"
						:authorID="r.authorID"
						:cid="r._id"
						:timestamp="r.timestamp"
						class="pt-1 mt-2"
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
import { feelings, faces } from '@/config'
import { createComment, getComment, getCommentsOfPost, ICommentData, sendComment } from '@/backend/comment'
import { getPhotoFromIPFS } from '@/backend/photos'
import { getProfileFromSession } from '@/store/session'
import { sendPostDeletion } from '@/backend/postDeletion'

interface IData {
	isReplying: boolean
	reply: string
	replies: ICommentData[]
	avatar: string
	name: string
	emotion: { label: string; light: any; dark: any }
	emotionType: string
	content: string
	showLabel: boolean
	dark: boolean
	commentDeleted: boolean
	showDelete: boolean
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
		parentCID: { type: Number, required: true },
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
			dark: false,
			commentDeleted: false,
			showDelete: false,
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
		this.replies = await getCommentsOfPost(this.cid)
		if (document.documentElement.classList.contains(`dark`)) {
			this.dark = true
		} else {
			this.dark = false
		}
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
			const c = createComment(this.$store.state.session.id, this.reply, `no-emotion`, this.cid)
			const _id = await sendComment(c, `reply`)
			this.replies.push({ _id, ...c })
			this.filterReplies()
			this.reply = ``
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
			} catch (err) {
				this.$toastWarning(`An error occured`)
			}
		},
		toggleDropdownDelete() {
			this.showDelete = !this.showDelete
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
