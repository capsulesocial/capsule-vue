<template>
	<div class="relative flex items-end">
		<button
			class="focus:outline-none hover:text-primary toggle flex items-end"
			:class="showSocialShares ? 'text-primary' : ''"
			@click.stop="toggleDropdown"
		>
			<div class="text-gray5 hover:text-primary hover:fill-primary flex">
				<ShareIcon :isActive="showSocialShares" />
				<span class="ml-1">{{ repostCount + repostOffset }}</span>
			</div>
		</button>
		<div
			v-show="showSocialShares"
			:class="
				$store.state.settings.darkMode
					? 'bg-lightBG text-lightPrimaryText border-lightBorder'
					: 'bg-darkBG text-darkPrimaryText border-darkBorder'
			"
			class="border-lightBorder modal-animation dropdownShareOpen absolute z-10 flex w-40 flex-col rounded-lg border p-2 shadow-lg"
			style="left: 53px"
		>
			<!-- Simple Repost -->
			<button
				:class="$store.state.settings.darkMode ? 'hover:text-lightActive' : 'hover:text-darkActive'"
				class="focus:outline-none text-gray5 flex"
				@click="handleRepost()"
			>
				<RepostIcon :isActive="isReposted" class="mr-2 p-1" />
				<span v-if="isReposted" class="self-center text-xs">Undo Repost</span>
				<span v-else class="self-center text-xs">Repost to Feed</span>
			</button>
			<!-- Quote Repost -->
			<button
				:class="$store.state.settings.darkMode ? 'hover:text-lightActive' : 'hover:text-darkActive'"
				class="focus:outline-none text-gray5 flex"
				@click="$emit(`toggleRepost`)"
			>
				<QuoteIcon class="mr-2 p-1" />
				<span class="self-center text-xs">Quote</span>
			</button>
			<!-- Twitter -->
			<button
				:class="$store.state.settings.darkMode ? 'hover:text-lightActive' : 'hover:text-darkActive'"
				class="focus:outline-none text-gray5 flex"
				@click="handleShare('TWITTER')"
			>
				<TwitterIcon class="mr-2 p-1" />
				<span class="self-center text-left text-xs">Share on Twitter</span>
			</button>
			<!-- Copy URL Link -->
			<button
				:class="$store.state.settings.darkMode ? 'hover:text-lightActive' : 'hover:text-darkActive'"
				class="focus:outline-none text-gray5 flex"
				@click="handleShare('URL')"
			>
				<LinkIcon class="mr-2 p-1" />
				<span class="self-center text-xs">Copy Link</span>
			</button>
		</div>
		<input :id="cid" type="hidden" value="" class="hidden" />
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import ShareIcon from '@/components/icons/Share.vue'
import TwitterIcon from '@/components/icons/brands/Twitter.vue'
import LinkIcon from '@/components/icons/Link.vue'
import RepostIcon from '@/components/icons/Repost.vue'
import QuoteIcon from '@/components/icons/Quote.vue'
import { Post } from '@/backend/post'
import { IRepost, sendRepost, getReposts } from '@/backend/reposts'
import { sendPostDeletion } from '@/backend/postDeletion'

interface IData {
	isReposted: boolean
	showSocialShares: boolean
	repostOffset: number
}

export default Vue.extend({
	components: {
		ShareIcon,
		TwitterIcon,
		LinkIcon,
		RepostIcon,
		QuoteIcon,
	},
	props: {
		repost: {
			type: Object as PropType<IRepost>,
			default: null,
		},
		post: {
			type: Object as PropType<Post>, // TODO fix the post type,
			required: true,
		},
		cid: {
			type: String,
			required: true,
		},
		hasRepost: {
			type: Function,
			required: true,
		},
		repostCount: {
			type: Number,
			required: true,
		},
	},
	data(): IData {
		return {
			showSocialShares: false,
			isReposted: false,
			repostOffset: 0,
		}
	},
	created() {
		this.isReposted = this.$store.getters.checkReposts(this.cid)
		// Unauth
		if (this.$store.state.session.id === ``) {
			this.isReposted = false
		}
		window.addEventListener(
			`click`,
			(e: any): void => {
				if (!e.target) {
					return
				}
				if (
					e.target.parentNode === null ||
					e.target.parentNode.classList === undefined ||
					!e.target.parentNode.classList.contains(`toggle`)
				) {
					this.showSocialShares = false
				}
			},
			false,
		)
	},
	methods: {
		sendRepost,
		getReposts,
		async handleRepost() {
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			// Post has NOT been reposted
			if (!this.isReposted) {
				const repostCID = await sendRepost(this.$store.state.session.id, this.cid, ``, `simple`)
				this.$store.commit(`addRepost`, { postID: this.cid, repostID: repostCID })
				this.$toastSuccess(`You have successfully reposted this post`)
				this.isReposted = true
				this.repostOffset += 1
			} else {
				// Undo repost
				// What do I call to undo a simple repost???
				const repostID = this.$store.state.reposts[this.cid]
				await sendPostDeletion(`HIDE`, repostID, this.$store.state.session.id)
				this.$store.commit(`removeRepost`, this.cid)
				this.isReposted = false
				this.repostOffset -= 1
				this.$toastSuccess(`This repost has been successfully removed from your profile`)
			}
			this.$emit(`repostAction`)
		},
		handleShare(type: string) {
			const shareElement = document.createElement(`textarea`)
			shareElement.value = `${document.location.origin}/post/${this.cid}`
			shareElement.style.opacity = `0`
			document.body.appendChild(shareElement)
			switch (type) {
				case `URL`:
					shareElement.focus()
					shareElement.select()
					const copied = document.execCommand(`copy`)
					this.$toastMessage(copied ? `Copied URL to clipboard` : `Not copied`)
					document.body.removeChild(shareElement)
					break
				case `TWITTER`:
					window.open(
						`https://twitter.com/share?url=${encodeURIComponent(shareElement.value)}&text=📰 ${this.post.title}\n 🔏 ${
							this.post.authorID
						} on @CapsuleSoc 🔗`,
					)
					break
				default:
					break
			}
			this.showSocialShares = false
		},
		toggleDropdown() {
			this.showSocialShares = !this.showSocialShares
		},
	},
})
</script>
<style>
.dropdownShareOpen::before {
	content: '';
	position: absolute;
	top: 5.5rem;
	left: -0.5rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
}
</style>
