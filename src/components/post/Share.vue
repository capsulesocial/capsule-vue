<template>
	<div class="relative flex items-end">
		<button
			class="focus:outline-none hover:text-primary dark:hover:text-secondary toggleShare flex items-end"
			:class="showSocialShares ? 'text-primary dark:text-secondary' : ''"
			@click.stop="toggleDropdown"
		>
			<div class="text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-secondary hover:fill-primary flex">
				<ShareIcon :isActive="showSocialShares" />
			</div>
		</button>
		<div
			v-show="showSocialShares"
			class="bg-lightBG dark:bg-darkBG text-lightPrimaryText dark:text-darkPrimaryText border-lightBorder modal-animation dropdownShareOpen absolute z-10 flex w-40 flex-col rounded-lg border p-2 shadow-lg"
			style="left: 40px"
		>
			<!-- Twitter -->
			<button
				class="focus:outline-none text-gray5 dark:text-gray3 flex hover:text-primary dark:hover:text-secondary"
				@click="handleShare('TWITTER')"
			>
				<TwitterIcon class="mr-2 p-1" />
				<span class="self-center text-left text-xs">Share on Twitter</span>
			</button>
			<!-- Copy URL Link -->
			<button
				class="focus:outline-none text-gray5 dark:text-gray3 flex hover:text-primary dark:hover:text-secondary"
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
import DOMPurify from 'dompurify'
import ShareIcon from '@/components/icons/Share.vue'
import TwitterIcon from '@/components/icons/brands/Twitter.vue'
import LinkIcon from '@/components/icons/Link.vue'
import { Post } from '@/backend/post'

interface IData {
	showSocialShares: boolean
}

export default Vue.extend({
	components: {
		ShareIcon,
		TwitterIcon,
		LinkIcon,
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
	data(): IData {
		return {
			showSocialShares: false,
		}
	},
	created() {
		window.addEventListener(
			`click`,
			(e: any): void => {
				if (!e.target) {
					return
				}
				if (
					e.target.parentNode === null ||
					e.target.parentNode.classList === undefined ||
					!e.target.parentNode.classList.contains(`toggleShare`)
				) {
					this.showSocialShares = false
				}
			},
			false,
		)
	},
	methods: {
		handleShare(type: string) {
			const shareElement = document.createElement(`textarea`)
			shareElement.value = `${document.location.origin}/post/${this.cid}`
			shareElement.style.opacity = `0`
			document.body.appendChild(shareElement)
			const title = DOMPurify.sanitize(this.post.title)
			switch (type) {
				case `URL`:
					shareElement.focus()
					shareElement.select()
					const copied = document.execCommand(`copy`)
					this.$toastMessage(copied ? `Copied URL to clipboard` : `Not copied`)
					break
				case `TWITTER`:
					window.open(
						`https://twitter.com/share?url=${encodeURIComponent(shareElement.value)}&text=📰 ${title}\n 🔏 ${
							this.post.authorID
						} on @CapsuleSoc 🔗`,
					)
					break
				default:
					break
			}
			document.body.removeChild(shareElement)
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
	top: 2.6rem;
	left: -0.5rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
}
</style>
