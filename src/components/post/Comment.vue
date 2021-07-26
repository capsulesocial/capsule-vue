<template>
	<div>
		<!-- Component that displays a posted comment -->
		<div class="flex">
			<!-- Avatar -->
			<div class="flex-shrink-0">
				<span v-if="this.avatar === '' || this.avatar === null" class="p-1 border-2 rounded-full block">
					<ProfileIcon class="w-6 h-6" />
				</span>
				<img v-else :src="this.avatar" class="w-10 h-10 rounded-lg object-cover" />
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
					:to="'/' + this.$props.comment.authorCID"
					:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
					class="text-gray-700 text-sm mr-2"
				>
					@{{ this.id }}
				</nuxt-link>
				<span
					v-if="comment.timestamp"
					:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
					class="text-xs font-sans"
				>
					{{ $formatDate(comment.timestamp) }}
				</span>
				<p class="text-base py-1 font-sans">
					{{ comment.content }}
				</p>
			</div>
		</div>
		<!-- Reply button -->
		<div class="ml-10 pl-1">
			<button class="font-sans text-xs focus:outline-none" @click="isReplying = !isReplying">
				{{ this.comment.replies.length }} Replies
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

<script>
import ProfileIcon from '@/components/icons/Person.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import Reply from '@/components/post/Reply.vue'

export default {
	components: {
		ProfileIcon,
		BrandedButton,
		Reply,
	},
	props: {
		comment: {
			type: Object,
			default: null,
		},
	},
	data() {
		return {
			isReplying: false,
			reply: ``,
			replies: this.comment.replies,
			avatar: ``,
			name: ``,
			id: ``,
		}
	},
	created() {
		this.$getProfile(this.$props.comment.authorCID).then((p) => {
			p.cid = this.$props.comment.authorCID
			this.name = p.name
			this.id = p.id
		})
		this.$getPhoto(this.$props.comment.authorAvatarCID).then((avatar) => {
			this.avatar = avatar
		})
	},
	methods: {
		sendReply() {
			if (this.comment === `` || !this.$qualityText(this.reply)) {
				alert(`Invalid reply!`)
			} else {
				const r = {
					postID: this.$props.comment.postID,
					commentID: this.$props.comment.id,
					authorID: this.$store.state.session.id,
					authorCID: this.$store.state.session.cid,
					authorAvatarCID: this.$store.state.session.avatar,
					content: this.reply,
					timestamp: new Date(),
				}
				// this.$store.commit('posts/commentReply', r)
				this.replies.push(r)
				this.filterReplies()
				this.reply = ``
			}
		},
		filterReplies() {
			const rList = this.replies.slice().sort((p0, p1) => {
				return p1.timestamp - p0.timestamp
			})
			return rList
		},
	},
}
</script>
