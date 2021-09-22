<template>
	<div>
		<!-- Component that displays a posted comment -->
		<div class="flex w-full">
			<!-- Avatar -->
			<div class="flex-shrink-0 relative">
				<div
					class="rounded-lg p-1"
					:style="emotion ? { backgroundImage: `url(${emotion.background})` } : {}"
					style="background-size: cover"
				>
					<Avatar :avatar="avatar" :authorID="authorID" size="w-12 h-12" />
					<span
						v-if="emotion"
						class="tooltip absolute rounded-full p-1 -mt-4 -ml-4"
						:style="{ backgroundImage: `url(${emotion.background})` }"
					>
						<img :src="emotion.image" class="bg-white rounded-full w-8 h-8" />
						<span class="tooltiptext bg-white bg-opacity-75 rounded-lg text-xs text-center text-black w-16 -ml-8">{{
							emotion.label
						}}</span>
					</span>
				</div>
			</div>
			<!-- Content -->
			<div class="flex-1 leading-relaxed ml-4 w-full overflow-hidden">
				<strong
					:class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
					class="font-bold bold mr-1"
				>
					{{ name }}
				</strong>
				<nuxt-link
					:to="'/' + authorID"
					:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
					class="text-gray-700 text-sm mr-2"
				>
					@{{ authorID }}
				</nuxt-link>
				<span
					v-if="timestamp"
					:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
					class="text-xs font-sans"
				>
					{{ $formatDate(timestamp) }}
				</span>
				<p class="text-base py-1 font-sans break-words">
					{{ content }}
				</p>
			</div>
		</div>
		<!-- Reply button -->
		<div class="ml-10 pl-1">
			<button class="font-sans text-xs focus:outline-none" @click="isReplying = !isReplying">
				{{ replies.length }} Replies
			</button>

			<!-- Active reply state -->
			<div v-if="isReplying" class="border-l pl-2 mr-5">
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
						:key="r.cid"
						:authorID="r.authorID"
						:cid="r.cid"
						:timestamp="r.timestamp"
						class="pt-1"
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
import { getProfile, Profile } from '@/backend/profile'
import { reactions } from '@/config'
import { createComment, getComment, getCommentsOfPost, sendComment } from '@/backend/comment'
import { getPhotoFromIPFS } from '@/backend/photos'
import { getProfileFromSession } from '@/store/session'

interface IData {
	isReplying: boolean
	reply: string
	replies: any[]
	avatar: string
	name: string
	emotion: { label: string; background: any; image: any } | null
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
			emotion: reactions.default,
			content: ``,
		}
	},
	async created() {
		const comment = await getComment(this.cid)
		this.content = comment.content
		const emotion = comment.emotion as keyof typeof reactions
		if (emotion in reactions) {
			this.emotion = reactions[emotion]
		} else {
			this.emotion = reactions.default
		}
	},
	async mounted() {
		let p = this.profile
		if (!p) {
			if (this.$store.state.session.id === this.authorID) {
				// Viewing own post
				p = getProfileFromSession(this.$store.state.session)
			} else {
				// Viewing someone else's post
				p = await getProfile(this.authorID)
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
		async sendReply() {
			if (!this.$qualityText(this.reply)) {
				alert(`Invalid reply!`)
			} else {
				const c = createComment(this.$store.state.session.id, this.reply, `no-emotion`, this.cid)
				const cid = await sendComment(c, `reply`)
				this.replies.push({ cid, ...c })
				this.filterReplies()
				this.reply = ``
			}
		},
		filterReplies(): any[] {
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