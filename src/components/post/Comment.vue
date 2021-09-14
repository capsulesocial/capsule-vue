<template>
	<div>
		<!-- Component that displays a posted comment -->
		<div class="flex">
			<!-- Avatar -->
			<div class="flex-shrink-0 relative">
				<div
					class="rounded-lg p-1"
					:style="emotion ? { backgroundImage: `url(${emotion.background})` } : {}"
					style="background-size: cover"
				>
					<span v-if="avatar === `` || avatar === null" class="p-1 border-2 rounded-lg block bg-white">
						<ProfileIcon class="w-12 h-12" />
					</span>
					<img v-else :src="avatar" class="w-12 h-12 rounded-lg object-cover" />
					<span
						v-if="emotion"
						class="absolute rounded-full p-1 -mt-4 -ml-4"
						:style="{ backgroundImage: `url(${emotion.background})` }"
					>
						<img :src="emotion.image" class="bg-white rounded-full w-8 h-8" />
					</span>
				</div>
			</div>
			<!-- Content -->
			<div class="flex-1 leading-relaxed ml-4">
				<strong
					:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
					class="font-bold bold mr-1"
				>
					{{ name }}
				</strong>
				<nuxt-link
					:to="'/' + authorID"
					:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
					class="text-gray-700 text-sm mr-2"
				>
					@{{ authorID }}
				</nuxt-link>
				<span
					v-if="timestamp"
					:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
					class="text-xs font-sans"
				>
					{{ $formatDate(timestamp) }}
				</span>
				<p class="text-base py-1 font-sans">
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
						this.$store.state.settings.darkMode
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
							this.$store.state.settings.darkMode
								? 'bg-lightBG text-lightPrimaryText'
								: 'bg-darkBG text-darkPrimaryText'
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
				<Reply
					v-for="r in filterReplies()"
					:key="r.cid"
					:authorID="r.authorID"
					:cid="r.cid"
					:timestamp="r.timestamp"
					class="pt-1"
				>
				</Reply>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import ProfileIcon from '@/components/icons/Person.vue'
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
		ProfileIcon,
		BrandedButton,
		Reply,
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
