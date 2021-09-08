<template>
	<div>
		<!-- Component that displays a posted comment -->
		<div class="flex">
			<!-- Avatar -->
			<div class="flex-shrink-0">
				<div
					class="rounded-lg p-1"
					:style="{ backgroundImage: `url(${this.emotion.background})` }"
					style="background-size: cover"
				>
					<span v-if="this.avatar === `` || this.avatar === null" class="p-1 border-2 rounded-lg block bg-white">
						<ProfileIcon class="w-6 h-6" />
					</span>
					<img v-else :src="this.avatar" class="w-10 h-10 rounded-lg object-cover" />
				</div>
			</div>
			<!-- Content -->
			<div class="flex-1 leading-relaxed ml-2">
				<strong
					:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
					class="font-bold bold mr-1"
				>
					{{ this.name }}
				</strong>
				<nuxt-link
					:to="'/' + this.$props.authorID"
					:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
					class="text-gray-700 text-sm mr-2"
				>
					@{{ this.$props.authorID }}
				</nuxt-link>
				<span
					v-if="this.$props.timestamp"
					:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
					class="text-xs font-sans"
				>
					{{ $formatDate(this.$props.timestamp) }}
				</span>
				<p class="text-base py-1 font-sans">
					{{ this.content }}
				</p>
			</div>
		</div>
		<!-- Reply button -->
		<div class="ml-10 pl-1">
			<button class="font-sans text-xs focus:outline-none" @click="isReplying = !isReplying">
				{{ this.replies.length }} Replies
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
							v-if="this.reply !== ''"
							text="Post"
							:action="sendReply"
							:thin="true"
							class="text-sm absolute bottom-0 right-0"
						/>
					</span>
				</div>
				<!-- List replies -->
				<Reply v-for="r in this.filterReplies()" :key="r.id" :reply="r" class="pt-1"> </Reply>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import ProfileIcon from '@/components/icons/Person.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import Reply from '@/components/post/Reply.vue'
import { getProfile } from '@/backend/profile'
import { reactions } from '@/config'
import { getComment } from '@/backend/comment'
import { getPhotoFromIPFS } from '@/backend/photos'

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
		const comment = await getComment(this.$props.cid)
		this.content = comment.content
		const emotion = comment.emotion as keyof typeof reactions
		if (emotion in reactions) {
			this.emotion = reactions[emotion]
		} else {
			this.emotion = reactions.default
		}
	},
	async mounted() {
		const p = await getProfile(this.$props.authorID)
		this.name = p.name
		if (p.avatar) {
			getPhotoFromIPFS(p.avatar).then((a) => {
				this.avatar = a
			})
		}
	},
	methods: {
		sendReply() {
			if (!this.$qualityText(this.reply)) {
				alert(`Invalid reply!`)
			} else {
				const r = {
					authorID: this.$store.state.session.id,
					authorCID: this.$store.state.session.cid,
					authorAvatarCID: this.$store.state.session.avatar,
					content: this.reply,
					timestamp: new Date(),
				}
				this.replies.push(r)
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
