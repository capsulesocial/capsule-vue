<template>
	<div class="flex items-end relative">
		<button
			class="flex items-end focus:outline-none hover:text-primary toggle"
			:class="showSocialShares ? 'text-primary' : ''"
			@click.stop="toggleDropdown"
		>
			<div class="flex text-gray7 hover:text-primary hover:fill-primary">
				<ShareIcon :isActive="showSocialShares" />
				<span class="ml-1">{{ repostCount }}</span>
			</div>
		</button>
		<div
			v-show="showSocialShares"
			:class="
				$store.state.settings.darkMode
					? 'bg-lightBG text-lightPrimaryText border-lightBorder'
					: 'bg-darkBG text-darkPrimaryText border-darkBorder'
			"
			class="absolute flex flex-col rounded-lg rounded-t-none w-40 shadow-lg z-10 p-1"
			style="top: -17px; left: 32px"
		>
			<!-- Repost -->
			<button
				:class="$store.state.settings.darkMode ? 'hover:text-lightActive' : 'hover:text-darkActive'"
				class="flex focus:outline-none"
				@click="handleRepost()"
			>
				<RepostIcon :isActive="isReposted()" :shrink="true" style="width: 13.7px" class="mr-2" />
				<span v-if="isReposted()" class="text-xs self-center">Undo Repost</span>
				<span v-else class="text-xs self-center">Repost to Feed</span>
			</button>
			<!-- Twitter -->
			<button
				:class="$store.state.settings.darkMode ? 'hover:text-lightActive' : 'hover:text-darkActive'"
				class="flex focus:outline-none"
				@click="handleShare('TWITTER')"
			>
				<TwitterIcon style="width: 13.7px" class="mr-2" />
				<span class="text-xs self-center text-left">Share on Twitter</span>
			</button>
			<!-- Copy URL Link -->
			<button
				:class="$store.state.settings.darkMode ? 'hover:text-lightActive' : 'hover:text-darkActive'"
				class="flex focus:outline-none"
				@click="handleShare('URL')"
			>
				<LinkIcon style="width: 13.7px" class="mr-2" />
				<span class="text-xs self-center">Copy Link</span>
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
import { Post } from '@/backend/post'
import { IRepost, sendRepost } from '@/backend/reposts'
import { sendPostDeletion } from '@/backend/postDeletion'

interface IData {
	isReposted: Function
	showSocialShares: boolean
}

export default Vue.extend({
	components: {
		ShareIcon,
		TwitterIcon,
		LinkIcon,
		RepostIcon,
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
			default: () => {},
		},
		repostCount: {
			type: Number,
			required: true,
		},
	},
	data(): IData {
		return {
			showSocialShares: false,
			isReposted: () => {
				return false
			},
		}
	},
	created() {
		this.isReposted = this.$props.hasRepost
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
		async handleRepost() {
			if (!this.isReposted()) {
				await sendRepost(this.$store.state.session.id, this.$props.cid, ``)
				this.isReposted = () => {
					return true
				}
			} else {
				await sendPostDeletion(`HIDE`, this.$props.repost._id, this.$props.repost.authorID)
				alert(`repost deleted`)
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
					alert(copied ? `Copied` : `Not copied`)
					document.body.removeChild(shareElement)
					break
				case `TWITTER`:
					window.open(
						`https://twitter.com/share?url=` +
							encodeURIComponent(shareElement.value) +
							`&text=` +
							`📰 ` +
							this.post.title +
							`\n 🔏 ` +
							this.post.authorID +
							` on @CapsuleSoc 🔗`,
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
