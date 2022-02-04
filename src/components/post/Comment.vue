<template>
	<div class="object-contain">
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
				class="flex w-full justify-between rounded-lg border border-dashed"
				:style="getStyle(`border-`)"
				style="backdrop-filter: blur(10px)"
			>
				<!-- Text -->
				<div class="flex w-full flex-grow flex-col px-3 py-1 pt-3">
					<!-- Top row: name, id, timestamp -->
					<div class="flex flex-wrap">
						<nuxt-link :to="`/id/` + authorID" class="mr-4 mb-2 flex items-center xl:mb-0">
							<Avatar :avatar="avatar" :authorID="authorID" size="w-8 h-8" class="mr-2 flex-shrink-0 xl:hidden" />
							<span v-if="name != ``" class="font-medium">
								{{ name }}
							</span>
							<span v-else class="text-gray5 font-medium">{{ authorID }}</span>
							<span class="text-primary ml-2 text-sm xl:text-base"> @{{ authorID }} </span>
							<span v-if="authorID === postAuthor" class="bg-primary ml-2 rounded-2xl bg-opacity-25 py-1 px-2 text-xs">
								Author
							</span>
						</nuxt-link>
						<span v-if="timestamp" class="self-center text-xs">
							{{ $formatDate(timestamp) }}
						</span>
					</div>
					<!-- Content -->
					<div class="flex">
						<div class="flex w-full flex-grow flex-col overflow-hidden">
							<p class="break-words py-1 font-sans text-lg leading-relaxed">
								{{ content }}
							</p>
							<div class="mt-8 flex h-full flex-row items-center">
								<button
									class="text-primary focus:outline-none text-left font-sans text-sm"
									@click="isReplying = !isReplying"
								>
									Reply
								</button>
								<p class="text-gray5 focus:outline-none text-left font-sans text-sm ml-4">
									{{ replies.length }} Replies
								</p>
							</div>
						</div>
						<div class="flex flex-shrink-0 items-center justify-center overflow-hidden xl:hidden">
							<img :src="emotion.image" class="-mb-1 mt-2 h-24 w-24 bg-transparent" />
						</div>
					</div>
				</div>
				<!-- Desktop reaction face -->
				<div class="hidden flex-shrink-0 items-center justify-center overflow-hidden xl:flex">
					<img :src="emotion.image" class="-mb-1 mt-2 h-32 w-32 bg-transparent" />
				</div>
			</div>
		</div>
		<!-- Reply button -->
		<div class="ml-3 pl-1 xl:ml-20">
			<!-- Active reply state -->
			<div v-if="isReplying" class="modal-animation mr-5 mt-4 border-l pl-2">
				<!-- Reply Input box -->
				<div
					v-if="$store.state.session.id !== ``"
					:class="
						$store.state.settings.darkMode
							? 'bg-lightBG text-lightPrimaryText border-lightBorder'
							: 'bg-darkBG text-darkPrimaryText border-darkBorder'
					"
					class="my-1 ml-5 flex w-full rounded-xl border-2 p-1"
				>
					<textarea
						v-model="reply"
						type="text"
						placeholder="Reply.."
						:class="
							$store.state.settings.darkMode ? 'bg-lightBG text-lightPrimaryText' : 'bg-darkBG text-darkPrimaryText'
						"
						class="resize-vertical focus:outline-none w-4/5 overflow-y-auto py-1 px-2 text-sm leading-normal"
						style="resize: none"
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
				<!-- List replies -->
				<div class="pl-5 pt-1">
					<Reply
						v-for="r in filterReplies()"
						:key="r._id"
						:authorID="r.authorID"
						:cid="r._id"
						:timestamp="r.timestamp"
						class="pt-1 pb-2"
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
import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import { feelings, faces } from '@/config'
import { createComment, getComment, getCommentsOfPost, ICommentData, sendComment } from '@/backend/comment'
import { getPhotoFromIPFS } from '@/backend/photos'
import { getProfileFromSession } from '@/store/session'

interface IData {
	isReplying: boolean
	reply: string
	replies: ICommentData[]
	avatar: string
	name: string
	emotion: { label: string; image: any }
	emotionType: string
	content: string
}

export default Vue.extend({
	name: `Comment`,
	components: {
		Reply,
		Avatar,
	},
	props: {
		authorID: { type: String, required: true },
		postAuthor: {
			type: String,
			default: ``,
		},
		cid: { type: String, required: true },
		timestamp: { type: Number, required: true },
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
