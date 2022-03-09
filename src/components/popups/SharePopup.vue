<template>
	<div
		class="popup bg-primary dark:bg-secondary modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
	>
		<!-- Container -->
		<div
			style="backdrop-filter: blur(10px)"
			class="w-full lg:w-600 min-h-40 max-h-90 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop card-animation z-10 overflow-y-auto rounded-lg bg-gradient-to-r p-6 pt-4 shadow-lg"
		>
			<div class="sticky flex items-center justify-between">
				<h2 class="text-primary dark:text-secondary text-3xl font-semibold">Share this post</h2>
				<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="$emit(`close`)">
					<CloseIcon />
				</button>
			</div>
			<div v-show="isLoading" class="modal-animation flex w-full justify-center z-20 mt-24">
				<div
					class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
					:style="dark ? `border-top: 2px solid #7097ac` : `border-top: 2px solid #2e556a`"
				></div>
			</div>
			<div v-show="!isLoading" class="flex w-full flex-col items-start mt-4">
				<!-- post preview -->
				<div class="bg-lightInput dark:bg-darkInput p-4 rounded-lg w-full flex flex-col lg:flex-row items-center">
					<img
						v-if="image != ``"
						:src="image"
						class="h-48 w-full lg:w-48 flex-shrink-0 rounded-lg object-cover xl:h-32 mb-4 lg:mb-0 lg:mr-4"
					/>
					<div class="flex max-w-full flex-col overflow-hidden">
						<p class="text-gray5 dark:text-gray3 text-sm mb-2">blogchain.app</p>
						<h3 class="break-words mb-1 text-base font-semibold dark:text-darkPrimaryText">
							{{ title }}
						</h3>
						<h6 v-if="(subtitle || excerpt) && image" class="max-w-420 break-words text-sm dark:text-darkSecondaryText">
							{{ subtitle ? subtitle : this.postExcerpt() }}
						</h6>
						<h6
							v-if="(subtitle || excerpt) && !image"
							class="max-w-mobileCard xl:max-w-700 break-words text-lightSecondaryText dark:text-darkSecondaryText"
						>
							{{ subtitle ? subtitle : this.postExcerpt() }}
						</h6>
					</div>
				</div>
				<!-- socials share -->
				<div class="flex flex-col mt-5">
					<label for="newName" class="mb-2 font-semibold dark:text-darkPrimaryText">Socials</label>
					<div class="flex flex-row flex-wrap">
						<button
							class="bg-lightInput dark:bg-darkInput text-secondary p-5 rounded-lg flex flex-row items-center mr-4 mb-2"
						>
							<TwitterIcon />
						</button>
						<button
							class="bg-lightInput dark:bg-darkInput text-secondary p-5 rounded-lg flex flex-row items-center mr-4 mb-2"
						>
							<FacebookIcon />
						</button>
						<button
							class="bg-lightInput dark:bg-darkInput text-secondary p-5 rounded-lg flex flex-row items-center mr-4 mb-2"
						>
							<RedditIcon />
						</button>
						<button
							class="bg-lightInput dark:bg-darkInput text-secondary p-5 rounded-lg flex flex-row items-center mr-4 mb-2"
						>
							<LinkedinIcon />
						</button>
						<button
							class="bg-lightInput dark:bg-darkInput text-secondary p-5 rounded-lg flex flex-row items-center mr-4 mb-2"
						>
							<MailIcon />
						</button>
					</div>
				</div>
				<!-- Direct Link -->
				<div class="flex flex-col mt-3 w-full">
					<label for="newName" class="mb-1 font-semibold dark:text-darkPrimaryText">Direct Link</label>
					<p class="text-gray5 dark:text-gray3 mb-2">Social media friendly link that you can share on any platform</p>
					<div class="relative flex w-full items-center">
						<input
							id="id"
							ref="DirectLink"
							v-model="generatedDirectLink"
							type="text"
							placeholder="https://blogchain.app/p/..."
							class="bg-gray1 dark:bg-gray7 dark:text-darkPrimaryText placeholder-gray5 dark:placeholder-gray3 flex-grow rounded-lg px-2 py-1 focus:outline-none"
							@focus="$event.target.select()"
						/>
						<button
							class="text-primary dark:text-secondary flex items-center focus:outline-none absolute right-0 mr-3 text-xs"
							@click="copyDirectLink"
						>
							<CopyIcon class="h-4 w-4 fill-current mr-1" />
							<p>Copy</p>
						</button>
					</div>
				</div>
				<!-- Expand Link -->
				<div class="message-header relative flex items-center justify-between mt-5 w-full" @click="toggleAccordion1">
					<div class="w-1/3 bg-gray3 dark:bg-gray2 rounded-lg" style="height: 1px"></div>
					<div
						:class="isOpen1 ? `plus0 hidden` : `plus1`"
						class="w-1/3 text-center icon flex flex-row items-center justify-center"
					>
						<p class="text-sm text-gray5 dark:text-gray3 mr-2">More</p>
						<ChevronDown class="text-gray5 dark:text-gray3" style="margin-top: 1px" />
					</div>
					<div
						:class="!isOpen1 ? `minus0 hidden` : `minus1`"
						class="w-1/3 text-center icon flex flex-row items-center justify-center"
					>
						<p class="text-sm text-gray5 dark:text-gray3 mr-2">Less</p>
						<ChevronUp class="text-gray5 dark:text-gray3" style="margin-top: 1px" />
					</div>
					<div class="w-1/3 bg-gray3 dark:bg-gray2 rounded-lg" style="height: 1px"></div>
				</div>
				<div :class="isOpen1 ? `mt-5` : `is-closed`" class="flex flex-col w-full message-body">
					<label for="newName" class="mb-1 font-semibold dark:text-darkPrimaryText">Blogchain Link</label>
					<p class="text-gray5 dark:text-gray3 mb-2">IPFS decentralized permanent link</p>
					<div class="relative flex w-full items-center">
						<input
							id="id"
							ref="BlogchainLink"
							v-model="generatedBlogchainLink"
							type="text"
							placeholder="https://blogchain.app/p/..."
							class="bg-gray1 dark:bg-gray7 dark:text-darkPrimaryText placeholder-gray5 dark:placeholder-gray3 flex-grow rounded-lg px-2 py-1 focus:outline-none"
							@focus="$event.target.select()"
						/>
						<button
							class="text-primary dark:text-secondary flex items-center focus:outline-none absolute right-0 mr-3 text-xs"
							@click="copyBlogchainLink"
						>
							<CopyIcon class="h-4 w-4 fill-current mr-1" />
							<p>Copy</p>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import CloseIcon from '@/components/icons/X.vue'
import TwitterIcon from '@/components/icons/brands/solid/Twitter.vue'
import FacebookIcon from '@/components/icons/brands/solid/Facebook.vue'
import RedditIcon from '@/components/icons/brands/solid/Reddit.vue'
import LinkedinIcon from '@/components/icons/brands/solid/Linkedin.vue'
import MailIcon from '@/components/icons/brands/solid/Mail.vue'
import CopyIcon from '@/components/icons/Copy.vue'
import ChevronDown from '@/components/icons/ChevronDown.vue'
import ChevronUp from '@/components/icons/ChevronUp.vue'

interface IData {
	generatedDirectLink: string
	generatedBlogchainLink: string
	isOpen1: boolean
	isLoading: boolean
	dark: boolean
}

export default Vue.extend({
	components: {
		CloseIcon,
		TwitterIcon,
		FacebookIcon,
		RedditIcon,
		LinkedinIcon,
		MailIcon,
		CopyIcon,
		ChevronDown,
		ChevronUp,
	},
	props: {
		image: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		subtitle: {
			type: String,
			required: true,
		},
		excerpt: {
			type: String,
			required: true,
		},
	},
	data(): IData {
		return {
			generatedDirectLink: ``,
			generatedBlogchainLink: ``,
			isOpen1: false,
			isLoading: true,
			dark: false,
		}
	},
	created() {
		window.addEventListener(`click`, this.handleCloseClick, false)
		this.generateShareableLink()
		// check dark mode
		if (document.documentElement.classList.contains(`dark`)) {
			this.dark = true
		} else {
			this.dark = false
		}
	},
	destroyed() {
		window.removeEventListener(`click`, this.handleCloseClick)
	},
	methods: {
		handleCloseClick(e: any): void {
			if (!e.target || e.target.parentNode === null || e.target.parentNode.classList === undefined) {
				return
			}
			if (e.target.classList[0] === `popup`) {
				this.closeDraftsPopup()
			}
		},
		closeDraftsPopup(): void {
			this.$emit(`close`)
		},
		handleWriteNewDraft() {
			this.$router.push(`/post`)
		},
		postExcerpt(): string {
			const excerpt = this.excerpt.slice(0, 127).trim()
			if (excerpt.endsWith(`...`)) {
				return excerpt
			}
			if (excerpt.endsWith(`..`)) {
				return excerpt + `.`
			}
			if (excerpt.endsWith(`.`)) {
				return excerpt + `..`
			}
			return excerpt + `...`
		},
		copyDirectLink(): void {
			if (this.generatedDirectLink === ``) {
				return
			}
			const code = this.$refs.DirectLink as HTMLElement
			code.focus()
			document.execCommand(`copy`)
			this.$toastSuccess(`Link copied to clipboard!`)
		},
		copyBlogchainLink(): void {
			if (this.generatedBlogchainLink === ``) {
				return
			}
			const code = this.$refs.BlogchainLink as HTMLElement
			code.focus()
			document.execCommand(`copy`)
			this.$toastSuccess(`Link copied to clipboard!`)
		},
		toggleAccordion1() {
			this.isOpen1 = !this.isOpen1
		},
		async generateShareableLink() {
			this.generatedDirectLink = `https://blogchain.app/p/a-day-in-the-life-of-jack/adu4fe2oh5fs7f`
			this.generatedDirectLink = this.generatedDirectLink.slice(0, 40).trim() + `...`
			this.generatedBlogchainLink = `https://blogchain.app/p/adu4fe2oh5fs7faoehfiohahfiaehfhaohfihahefihafo`
			this.generatedBlogchainLink = this.generatedBlogchainLink.slice(0, 40).trim() + `...`
			await this.sleep(500)
			this.isLoading = false
		},
		sleep(ms: any) {
			return new Promise((resolve) => setTimeout(resolve, ms))
		},
	},
})
</script>
<style>
.message-header {
	cursor: pointer;
}

.message-header .icon {
	transition: all 0.6s;
}

.message-body {
	padding: 0;
	max-height: 20em;
	overflow: hidden;
	transition: all 0.6s;
}
.plus0 {
	opacity: 0;
}

.plus1 {
	opacity: 1;
}

.minus0 {
	opacity: 0;
}

.minus1 {
	opacity: 1;
}

.is-closed {
	max-height: 0;
}
</style>