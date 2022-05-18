<template>
	<div class="">
		<!-- Featured image -->
		<article
			class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder mb-5 rounded-lg border bg-gradient-to-r px-6 py-4 shadow-lg"
			style="backdrop-filter: blur(10px)"
		>
			<h6 class="text-lightPrimaryText dark:text-darkPrimaryText font-semibold">Featured Image</h6>
			<button
				class="border-gray5 dark:border-gray3 transition duration-500 ease-in-out hover:border-primary focus:outline-none mt-3 mb-2 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed"
				@click="handleUploadImageClick"
			>
				<input
					id="featured-photo"
					ref="featuredPhoto"
					class="hidden"
					name="photo"
					type="file"
					accept="image/jpeg, image/png"
					@change="handleImage"
				/>
				<!-- No Photo Uploaded -->
				<div
					v-if="waitingImage"
					class="absolute w-11/12 h-44 bg-lightInput dark:bg-gray7 rounded-lg animate-pulse flex justify-center items-center"
				>
					<p class="text-sm text-gray5 dark:text-gray3">Uploading image...</p>
				</div>
				<div v-if="featuredPhoto === null && !waitingImage" class="flex flex-col justify-center">
					<UploadIcon class="self-center text-gray5 dark:text-gray3" />
					<p class="text-primary mt-2 text-left text-sm font-light">Upload an Image</p>
				</div>
				<div v-else class="h-full w-full">
					<img :src="featuredPhoto" class="h-40 w-full object-cover" />
				</div>
			</button>
			<!-- Photo Uploaded -->
			<div v-if="featuredPhoto !== null" class="w-full">
				<button class="text-primary focus:outline-none text-sm" @click="handleUploadImageClick">Change Image</button>
				<button class="text-negative focus:outline-none ml-4 text-sm" @click="removeImage()">Remove Image</button>
			</div>
			<div
				class="bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray3 placeholder-gray5 dark:placeholder-gray3 my-1 mt-3 w-full rounded-lg p-2"
				:class="featuredPhoto ? `` : `hidden`"
			>
				<label for="caption" class="hidden" value="Enter hashtags"></label>
				<input
					v-model="caption"
					type="text"
					placeholder="Image caption"
					class="focus:outline-none bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray1 placeholder-gray5 dark:placeholder-gray3 w-full"
					@change="saveCaption"
				/>
			</div>
		</article>
		<!-- Category -->
		<article
			class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder mb-5 rounded-lg border bg-gradient-to-r px-6 py-4 shadow-lg"
			style="backdrop-filter: blur(10px)"
		>
			<h6 class="text-lightPrimaryText dark:text-darkPrimaryText font-semibold">Category</h6>
			<button
				class="bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray3 placeholder-gray5 dark:placeholder-gray3 focus:outline-none my-1 mt-3 w-full rounded-lg p-2"
				@click="showCategoryDropdown = !showCategoryDropdown"
			>
				<div class="flex items-center justify-between">
					<div v-if="category" class="flex flex-row items-center">
						<img
							:src="getCategoryIcon($store.state.draft.drafts[$store.state.draft.activeIndex].category)"
							class="hotzone mr-2 h-10 w-10"
						/>
						<span class="text-primary dark:text-gray1 text-base capitalize">{{
							$store.state.draft.drafts[$store.state.draft.activeIndex].category.replace(`-`, ` `)
						}}</span>
					</div>
					<div v-else class="text-gray5 dark:text-gray3">Select a Category</div>
					<ChevronUp v-if="showCategoryDropdown" />
					<ChevronDown v-else />
				</div>
			</button>
			<div v-show="showCategoryDropdown" class="flex flex-col">
				<button
					v-for="c in categoryList"
					:key="c"
					class="focus:outline-none modal-animation flex h-10 w-full items-center px-2 capitalize"
					@click="changeCategory(c)"
				>
					<img :src="getCategoryIcon(c)" class="hotzone mr-1 ml-2 h-6 w-6" />
					<span class="ml-2" :class="category === c ? ' font-semibold text-primary' : ' text-gray5 dark:text-gray3'">
						{{ c.replace(`-`, ` `) }}</span
					>
				</button>
			</div>
		</article>
		<!-- Tags -->
		<article
			class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder mb-5 rounded-lg border bg-gradient-to-r px-6 py-4 pb-6 shadow-lg"
			style="backdrop-filter: blur(10px)"
		>
			<h6 class="text-lightPrimaryText dark:text-darkPrimaryText mb-3 font-semibold">Tags</h6>
			<div
				class="bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray3 placeholder-gray5 dark:placeholder-gray3 my-1 w-full rounded-lg p-2"
			>
				<label for="tag" class="hidden" value="Enter hashtags"></label>
				<input
					v-model="tag"
					type="text"
					placeholder="Add a tag..."
					class="focus:outline-none bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray1 placeholder-gray5 dark:placeholder-gray3 w-full"
					@keyup.enter="addTag"
				/>
			</div>
			<div class="flex flex-row flex-wrap">
				<button
					v-for="t in $store.state.draft.drafts[$store.state.draft.activeIndex].tags"
					:key="t.name"
					class="focus:outline-none bg-gray1 dark:bg-gray7 z-10 mr-4 mt-2 flex flex-row items-center rounded-lg px-3 py-1"
					@click="removeTag(t)"
				>
					<span class="text-gray5 dark:text-gray1 text-sm font-semibold">{{ t.name }}</span
					><XIcon class="text-gray5 dark:text-gray1 p-1 pr-0" />
				</button>
			</div>
		</article>
		<!-- Premium post -->
		<article
			v-if="this.$store.getters[`paymentProfile/getPaymentProfile`](this.$store.state.session.id).paymentsEnabled"
			class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder mb-5 rounded-lg border bg-gradient-to-r p-6 py-5 shadow-lg"
			style="backdrop-filter: blur(10px)"
		>
			<div class="flex flex-row justify-between items-center">
				<div class="flex flex-col items-start">
					<p class="text-gray5 dark:text-gray3 text-sm">This post is for subscribers only</p>
					<button
						class="text-neutral text-sm mt-1"
						:class="
							this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].encrypted
								? ``
								: `opacity-50 cursor-not-allowed`
						"
						:disabled="!this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].encrypted"
						@click="openTiers"
					>
						Manage access
					</button>
				</div>
				<PremiumSwitchEditor
					:enabled="this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].encrypted"
					@toggle="togglePremiumPost"
				/>
			</div>
		</article>
		<!-- Publish -->
		<article
			class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder mb-5 rounded-lg border bg-gradient-to-r p-6 shadow-lg"
			style="backdrop-filter: blur(10px)"
		>
			<div class="flex flex-row items-center justify-between">
				<div>
					<h5 v-show="wordCount > 1" class="text-gray5 dark:text-gray3 text-sm">
						<span class="text-primary">{{ wordCount }}</span> words
					</h5>
					<h5 class="text-gray5 dark:text-gray3 text-sm">Auto-save on close.</h5>
				</div>
				<button
					class="focus:outline-none bg-primary text-lightButtonText transform rounded-lg px-12 py-2 font-bold shadow-lg transition duration-500 ease-in-out hover:scale-105"
					@click="confirmPost"
				>
					Publish
				</button>
			</div>
		</article>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import XIcon from '@/components/icons/X.vue'
import UploadIcon from '@/components/icons/Upload.vue'
import ChevronUp from '@/components/icons/ChevronUp.vue'
import ChevronDown from '@/components/icons/ChevronDown.vue'
import PremiumSwitchEditor from '@/components/PremiumSwitchEditor.vue'

import { addPhotoToIPFS, preUploadPhoto } from '@/backend/photos'
import { categories } from '@/config/config'
import { Tag } from '@/backend/post'
import { getCompressedImage } from '@/backend/utilities/imageCompression'
import { getPhotoFromIPFS } from '@/backend/getPhoto'

interface IData {
	featuredPhoto: null | unknown
	categoryList: string[]
	category: string
	tag: string
	caption: string
	showCategoryDropdown: boolean
	featuredPhotoTarget: null | HTMLInputElement
	waitingImage: boolean
}

export default Vue.extend({
	components: {
		XIcon,
		UploadIcon,
		ChevronUp,
		ChevronDown,
		PremiumSwitchEditor,
	},
	props: {
		wordCount: {
			type: Number,
			default: 0,
		},
	},
	data(): IData {
		return {
			featuredPhoto: null,
			categoryList: categories,
			category: ``,
			tag: ``,
			caption: ``,
			showCategoryDropdown: false,
			featuredPhotoTarget: null,
			waitingImage: false,
		}
	},
	watch: {
		'$store.state.draft.activeIndex'() {
			this.fetchActiveDraft()
		},
	},
	mounted() {
		this.fetchActiveDraft()
	},
	methods: {
		fetchActiveDraft(): void {
			this.featuredPhoto = null
			const { featuredPhotoCID } = this.$store.state.draft.drafts[this.$store.state.draft.activeIndex]
			if (featuredPhotoCID !== null) {
				this.featuredPhoto = this.downloadImage(featuredPhotoCID)
			}
			this.caption = this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].featuredPhotoCaption
			this.category = this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].category
		},
		saveCaption(): void {
			// save caption to draft state
			this.$store.commit(`draft/updateFeaturedPhotoCaption`, this.caption)
		},
		confirmPost(): void {
			this.$emit(`confirm`)
		},
		addTag(): void {
			const { tags } = this.$store.state.draft.drafts[this.$store.state.draft.activeIndex]
			const tagsCheck = this.$qualityTags(this.tag, tags)
			if (this.$isError(tagsCheck)) {
				this.$toastError(tagsCheck.error)
				return
			}

			const t: Tag = {
				name: this.tag,
			}
			this.$store.commit(`draft/addTag`, t)
			this.tag = ``
		},
		removeTag(t: Tag): void {
			this.$store.commit(`draft/removeTag`, t)
		},
		changeCategory(c: string) {
			this.category = c
			this.$store.commit(`draft/updateCategory`, this.category)
			this.showCategoryDropdown = false
		},
		removeImage(): void {
			this.featuredPhoto = null
			if (this.featuredPhotoTarget) {
				this.featuredPhotoTarget.value = ``
			}
			this.caption = ``
			this.$store.commit(`draft/updateFeaturedPhotoCaption`, null)
			this.$store.commit(`draft/updateFeaturedPhotoCID`, null)
		},
		async uploadImage(image: any, blobImage: Blob, filename: string): Promise<void> {
			const cid = await addPhotoToIPFS(image)
			await preUploadPhoto(cid, blobImage, filename, this.$store.state.session.id)
			this.$store.commit(`draft/updateFeaturedPhotoCID`, cid)
			await this.downloadImage(cid)
			this.waitingImage = false
		},
		async downloadImage(cid: string): Promise<void> {
			this.featuredPhoto = await getPhotoFromIPFS(cid)
		},
		handleUploadImageClick(): void {
			if (this.$refs.featuredPhoto) {
				const element = this.$refs.featuredPhoto as HTMLInputElement
				element.click()
			}
		},
		async handleImage(e: Event): Promise<void> {
			const eventTarget = e.target
			if (!eventTarget) {
				return
			}

			const target = eventTarget as HTMLInputElement
			this.featuredPhotoTarget = target
			if (!target.files || target.files.length < 1) {
				return
			}
			const image = target.files[0]
			if (!image) {
				return
			}
			try {
				this.waitingImage = true
				const compressedImage = await getCompressedImage(image)
				const reader = new FileReader()
				reader.readAsDataURL(compressedImage)
				reader.onload = (i) => {
					if (i.target !== null) {
						this.uploadImage(i.target.result, compressedImage, image.name).catch((err) => {
							target.value = ``
							this.waitingImage = false
							this.$handleError(err)
						})
					}
				}
				reader.onerror = (_ev) => {
					target.value = ``
					throw new Error(`Something went wrong while loading the image`)
				}
			} catch (err: unknown) {
				target.value = ``
				this.waitingImage = false
				this.$handleError(err)
			}
		},
		handleCategoryDropdown(e: any): void {
			if (!e.target || e.target.parentNode === null || e.target.parentNode.classList === undefined) {
				return
			}
			if (!e.target.parentNode.classList.contains(`toggle`)) {
				this.showCategoryDropdown = false
			}
		},
		getCategoryIcon(category: string) {
			const c = category || this.category
			return c ? require(`@/assets/images/category/${c}/${this.$colorMode.dark ? `dark` : `light`}/icon.webp`) : ``
		},
		togglePremiumPost() {
			this.$store.commit(`draft/togglePremium`)
		},
		openTiers() {
			this.$emit(`openTierAccess`)
		},
	},
})
</script>
