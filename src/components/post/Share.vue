<template>
	<div class="flex items-end relative">
		<button
			class="flex items-end focus:outline-none hover:text-primary toggle"
			:class="showSocialShares ? 'text-primary' : ''"
			@click.stop="toggleDropdown"
		>
			<ShareIcon :isActive="showSocialShares" class="mr-2" />
		</button>
		<div
			v-show="showSocialShares"
			:class="
				$store.state.settings.darkMode
					? 'bg-lightBG text-lightPrimaryText border-lightBorder'
					: 'bg-darkBG text-darkPrimaryText border-darkBorder'
			"
			class="absolute flex flex-col rounded-lg rounded-t-none w-40 shadow-lg z-20"
			style="padding: 16px; top: 40px"
		>
			<!-- Repost -->
			<button
				:class="$store.state.settings.darkMode ? 'hover:text-lightActive' : 'hover:text-darkActive'"
				class="flex focus:outline-none"
				@click="handleRepost()"
			>
				<RepostIcon :isActive="isReposted" :shrink="true" style="width: 13.7px" class="mr-2" />
				<span
					v-if="isReposted"
					:class="$store.state.settings.darkMode ? 'text-lightActive' : 'text-darkActive'"
					class="text-xs self-center"
					>Undo Repost</span
				>
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
import { sendRepost, getReposts } from '@/backend/reposts'

export default Vue.extend({
	components: {
		ShareIcon,
		TwitterIcon,
		LinkIcon,
		RepostIcon,
	},
	props: {
		post: {
			type: Object as PropType<Post>, // TODO fix the post type,
			required: true,
		},
		cid: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			showSocialShares: false,
			isReposted: false,
		}
	},
	async created() {
		const res = await getReposts(this.$store.state.session.id, `NEW`, this.$props.post._id)
		for (const r in res) {
			// @ts-ignore
			if (this.$props.cid === res[r].repost.postCID) {
				this.isReposted = true
			}
		}
	},
	mounted() {
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
			if (!this.isReposted) {
				await sendRepost(this.$store.state.session.id, this.$props.post._id, ``)
				this.isReposted = true
			} else {
				alert(`Cannot undo repost at this time`)
			}
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
