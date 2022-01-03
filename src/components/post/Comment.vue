<template>
	<div class="object-contain">
		<!-- Component that displays a posted comment -->
		<div class="flex w-full mt-4">
			<div class="flex justify-between items-start mr-4">
				<span class="rounded-lg px-1 pt-1 flex-shrink-0" :style="getStyle(`bg-`)">
					<Avatar
						:avatar="avatar"
						:authorID="authorID"
						size="w-12 h-12"
						style="margin-top: 2px; margin-left: 2px; margin-right: 2px"
					/>
				</span>
			</div>
			<!-- Dashed bubble -->
			<div class="border rounded-lg w-full flex justify-between border-dashed" :style="getStyle(`border-`)">
				<!-- Text -->
				<div class="flex flex-col flex-grow w-full px-4 py-2">
					<!-- Top row: name, id, timestamp -->
					<div class="flex">
						<nuxt-link :to="`/` + authorID" class="flex mr-4 flex-row items-center">
							<span class="font-medium">
								{{ name }}
							</span>
							<span class="ml-2 text-primary"> @{{ authorID }} </span>
						</nuxt-link>
						<span v-if="timestamp" class="text-xs self-center">
							{{ $formatDate(timestamp) }}
						</span>
					</div>
					<!-- Content -->
					<div class="flex flex-col flex-grow w-full overflow-hidden">
						<p class="text-lg py-1 font-sans break-words leading-relaxed">
							{{ content }}
						</p>
						<div class="h-full flex flex-col-reverse">
							<button
								class="font-sans text-sm text-lightSecondaryText focus:outline-none flex-grow-0 w-24 text-left"
								@click="isReplying = !isReplying"
							>
								{{ replies.length }} Replies
							</button>
						</div>
					</div>
				</div>
				<div class="flex-shrink-0 flex justify-center items-center overflow-hidden">
					<img :src="emotion.leftImage" class="bg-transparent w-32 h-32 -mb-1 mt-2" />
				</div>
			</div>
		</div>
		<!-- Reply button -->
		<div class="ml-10 pl-1">
			<!-- Active reply state -->
			<div v-if="isReplying" class="border-l pl-2 mr-5 modal-animation mt-4">
				<!-- Reply Input box -->
				<div
					:class="
						$store.state.settings.darkMode
							? 'bg-lightBG text-lightPrimaryText border-lightBorder'
							: 'bg-darkBG text-darkPrimaryText border-darkBorder'
					"
					class="flex border-2 rounded-xl my-1 p-1 ml-5 w-full"
				>
					<textarea
						v-model="reply"
						type="text"
						placeholder="Reply.."
						:class="
							$store.state.settings.darkMode ? 'bg-lightBG text-lightPrimaryText' : 'bg-darkBG text-darkPrimaryText'
						"
						class="leading-normal resize-vertical overflow-y-auto w-full focus:outline-none py-1 px-2 text-sm"
					>
					</textarea>
					<span class="relative">
						<BrandedButton
							v-if="reply !== ''"
							text="Post"
							:action="sendReply"
							:thin="true"
							class="text-sm absolute bottom-0 right-0"
						/>
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
import BrandedButton from '@/components/BrandedButton.vue'
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
	emotion: { label: string; leftImage: any; rightImage: any }
	emotionType: string
	content: string
}

export default Vue.extend({
	name: `Comment`,
	components: {
		BrandedButton,
		Reply,
		Avatar,
	},
	props: {
		authorID: { type: String, required: true },
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
			if (feelings.positive.includes(this.emotionType)) {
				res += `#1F7DAD`
			} else if (feelings.negative.includes(this.emotionType)) {
				res += `#EE1F63`
			} else {
				res += `#F0B785`
			}
			return res
		},
		async sendReply() {
			if (!this.$qualityText(this.reply)) {
				this.$toastError(`Invalid reply`)
			} else {
				const c = createComment(this.$store.state.session.id, this.reply, `no-emotion`, this.cid)
				const _id = await sendComment(c, `reply`)
				this.replies.push({ _id, ...c })
				this.filterReplies()
				this.reply = ``
			}
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
