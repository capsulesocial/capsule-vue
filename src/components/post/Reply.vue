<template>
	<div v-if="!replyDeleted" class="flex relative">
		<div class="flex-shrink-0 mr-2">
			<Avatar :avatar="avatar" :authorID="authorID" size="w-10 h-10" />
		</div>
		<div class="ml-2 flex-1 leading-relaxed">
			<div class="flex flex-row items-center">
				<strong v-if="name !== ``" class="bold mr-2 font-bold text-lightPrimaryText dark:text-darkPrimaryText">
					{{ name }}
				</strong>
				<strong v-else class="bold mr-2 font-bold text-gray5 dark:text-gray3">
					{{ authorID }}
				</strong>
				<nuxt-link :to="`/id/` + authorID" class="mr-4 text-sm text-primary dark:text-secondary">
					@{{ authorID }}
				</nuxt-link>
				<span v-if="timestamp" class="text-xs text-gray5 dark:text-gray3">
					{{ $formatDate(timestamp) }}
				</span>
				<!-- Three dots dropdown -->
				<button
					v-if="this.$store.state.session.id === authorID || this.$store.state.session.id === commenterID"
					class="focus:outline-none absolute top-0 right-0 flex-col justify-start text-gray5 dark:text-gray3 pt-2 pr-3"
					@click.stop="toggleDropdownDelete"
				>
					<MoreIcon />
				</button>
				<div
					v-show="showDelete"
					class="border-lightBorder modal-animation absolute z-10 flex w-44 flex-col items-center rounded-lg border bg-lightBG dark:bg-darkBG p-1 shadow-lg"
					:class="dark ? `dropdownDeleteOpenDark` : `dropdownDeleteOpen`"
					style="top: 40px; right: 0px"
				>
					<!-- Delete -->
					<button class="focus:outline-none text-negative flex" @click="removeReply">
						<BinIcon class="p-1" />
						<span class="text-negative self-center text-xs ml-1 mr-1">Remove this reply</span>
					</button>
				</div>
			</div>
			<p class="py-1 text-sm text-lightPrimaryText dark:text-darkSecondaryText">
				{{ content }}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import axios from 'axios'
import Avatar from '@/components/Avatar.vue'
import MoreIcon from '@/components/icons/More.vue'
import BinIcon from '@/components/icons/Bin.vue'
import { getPhotoFromIPFS } from '@/backend/photos'
import { getComment } from '@/backend/comment'
import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import { getProfileFromSession } from '@/store/session'
import { sendPostDeletion } from '@/backend/postDeletion'

interface IData {
	avatar?: string
	content: string
	name: string
	replyDeleted: boolean
	showDelete: boolean
	dark: boolean
}

export default Vue.extend({
	components: {
		Avatar,
		MoreIcon,
		BinIcon,
	},
	props: {
		commenterID: { type: String, required: true },
		authorID: { type: String, required: true },
		cid: { type: String, required: true },
		timestamp: { type: Number, required: true },
		profile: { type: Object as PropType<Profile>, default: null },
	},
	data(): IData {
		return {
			avatar: ``,
			content: ``,
			name: ``,
			replyDeleted: false,
			showDelete: false,
			dark: false,
		}
	},
	async created() {
		const comment = await getComment(this.cid)
		this.content = comment.content
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
		// check for dark mode
		if (document.documentElement.classList.contains(`dark`)) {
			this.dark = true
		} else {
			this.dark = false
		}
		// Close more dropdown
		window.addEventListener(`click`, () => {
			if (this.showDelete) {
				this.showDelete = false
			}
		})
	},
	methods: {
		async removeReply() {
			try {
				await sendPostDeletion(`HIDE`, this.cid, this.$store.state.session.id)
				this.replyDeleted = true
				this.$toastSuccess(`This reply has been successfully removed`)
				this.$emit(`updateReplies`)
			} catch (err: unknown) {
				if (axios.isAxiosError(err)) {
					if (!err.response) {
						this.$toastError(`Network error, please try again`)
						return
					}
					if (err.response.status === 429) {
						this.$toastError(`Too many requests, please try again in a minute`)
						return
					}
					if (err instanceof Error) {
						this.$toastError(err.message)
						return
					}
					throw err
				}
			}
		},
		toggleDropdownDelete() {
			this.showDelete = !this.showDelete
		},
	},
})
</script>
