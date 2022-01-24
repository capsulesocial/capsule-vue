<template>
	<div class="">
		<!-- Featured image -->
		<article
			class="from-lightBGStart to-lightBGStop border-lightBorder mb-5 rounded-lg border bg-gradient-to-r px-6 py-4 shadow-lg"
			style="backdrop-filter: blur(10px)"
		>
			<h6 class="text-primary font-semibold">Featured Image</h6>
			<button
				class="border-primary focus:outline-none mt-3 mb-2 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed"
				@click="handleUploadImageClick"
			>
				<input
					id="featured-photo"
					ref="featuredPhoto"
					class="hidden"
					name="photo"
					type="file"
					accept="image/jpeg, imag/png"
					@change="handleImage"
				/>
				<!-- No Photo Uploaded -->
				<div v-if="featuredPhoto === null" class="flex flex-col justify-center">
					<UploadIcon class="self-center" />
					<p class="text-primary mt-2 text-left text-sm font-light">Upload an Image</p>
				</div>
				<div v-else class="h-full w-full">
					<img :src="featuredPhoto" class="h-40 w-full object-cover" />
				</div>
			</button>
			<!-- Photo Uploaded -->
			<div v-if="featuredPhoto !== null" class="w-full">
				<button class="text-primary focus:outline-none text-sm" @click="handleUploadImageClick">Change Image</button>
				<button class="text-lightError focus:outline-none ml-4 text-sm" @click="removeImage()">Remove Image</button>
			</div>
			<div class="bg-gray1 my-1 mt-3 w-full rounded-lg p-2" :class="featuredPhoto ? `` : `hidden`">
				<label for="caption" class="hidden" value="Enter hashtags"></label>
				<input
					v-model="caption"
					type="text"
					placeholder="Image caption"
					class="focus:outline-none bg-gray1 placeholder-gray5 w-full"
					@change="saveCaption"
				/>
			</div>
		</article>
		<!-- Category -->
		<article
			class="from-lightBGStart to-lightBGStop border-lightBorder mb-5 rounded-lg border bg-gradient-to-r px-6 py-4 shadow-lg"
			style="backdrop-filter: blur(10px)"
		>
			<h6 class="text-primary font-semibold">Category</h6>
			<button
				class="bg-gray1 focus:outline-none my-1 mt-3 w-full rounded-lg p-2"
				@click="showCategoryDropdown = !showCategoryDropdown"
			>
				<div class="flex items-center justify-between">
					<div v-if="category" class="flex flex-row items-center">
						<img
							:src="
								require(`@/assets/images/category/` +
									$store.state.draft.drafts[$store.state.draft.activeIndex].category +
									`/icon.webp`)
							"
							class="hotzone mr-2 h-10 w-10"
						/>
						<span class="text-primary text-base">{{
							$store.state.draft.drafts[$store.state.draft.activeIndex].category
						}}</span>
					</div>
					<div v-else>Select a Category</div>
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
					<img :src="require(`@/assets/images/category/` + c + `/icon.webp`)" class="hotzone mr-1 ml-2 h-6 w-6" />
					<span
						class="ml-2 border-b"
						:class="category === c ? 'border-primary text-primary' : ' text-lightPrimaryVariant border-transparent'"
					>
						{{ c }}</span
					>
				</button>
			</div>
		</article>
		<!-- Tags -->
		<article
			class="from-lightBGStart to-lightBGStop border-lightBorder mb-5 rounded-lg border bg-gradient-to-r px-6 py-4 pb-6 shadow-lg"
			style="backdrop-filter: blur(10px)"
		>
			<h6 class="text-primary mb-3 font-semibold">Tags</h6>
			<div class="bg-gray1 my-1 w-full rounded-lg p-2">
				<label for="tag" class="hidden" value="Enter hashtags"></label>
				<input
					v-model="tag"
					type="text"
					placeholder="Add a tag..."
					class="focus:outline-none bg-gray1 placeholder-gray5"
					@keyup.enter="addTag"
				/>
			</div>
			<div class="flex flex-row">
				<button
					v-for="t in $store.state.draft.drafts[$store.state.draft.activeIndex].tags"
					:key="t.name"
					class="focus:outline-none bg-gray1 z-10 mr-4 mt-2 flex flex-row items-center rounded-lg px-3 py-1"
					@click="removeTag(t)"
				>
					<span class="text-gray5 text-sm font-semibold">{{ t.name }}</span
					><XIcon class="text-gray5 p-1 pr-0" />
				</button>
			</div>
		</article>
		<article
			class="from-lightBGStart to-lightBGStop border-lightBorder mb-5 rounded-lg border bg-gradient-to-r p-6 shadow-lg"
			style="backdrop-filter: blur(10px)"
		>
			<div class="flex flex-row items-center justify-between">
				<div>
					<h5 v-show="wordCount > 1" class="text-gray5 text-sm">
						<span class="text-primary">{{ wordCount }}</span> words
					</h5>
					<h5 class="text-gray5 text-sm">Auto-save on close.</h5>
				</div>
				<button
					class="focus:outline-none bg-lightButtonBG text-lightButtonText transform rounded-lg px-12 py-2 font-bold shadow-lg transition duration-500 ease-in-out hover:scale-105"
					@click="handlePost"
				>
					Publish
				</button>
			</div>
		</article>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import imageCompression from 'browser-image-compression'
import XIcon from '@/components/icons/X.vue'
import UploadIcon from '@/components/icons/Upload.vue'
import ChevronUp from '@/components/icons/ChevronUp.vue'
import ChevronDown from '@/components/icons/ChevronDown.vue'

import { addPhotoToIPFS, getPhotoFromIPFS, preUploadPhoto } from '@/backend/photos'
import { categories } from '@/config'
import { Tag } from '@/backend/post'

interface IData {
	featuredPhoto: null | any
	categoryList: string[]
	category: string
	tag: string
	caption: string
	showCategoryDropdown: boolean
}

export default Vue.extend({
	components: {
		XIcon,
		UploadIcon,
		ChevronUp,
		ChevronDown,
	},
	props: {
		wordCount: {
			type: Number,
			default: 0,
		},
	},
	data(): IData {
		const { category } = this.$store.state.draft.drafts[this.$store.state.draft.activeIndex]
		return {
			featuredPhoto: null,
			categoryList: categories,
			category,
			tag: ``,
			caption: this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].featuredPhotoCaption,
			showCategoryDropdown: false,
		}
	},
	mounted() {
		const { featuredPhotoCID } = this.$store.state.draft.drafts[this.$store.state.draft.activeIndex]
		if (featuredPhotoCID !== null) {
			this.featuredPhoto = this.downloadImage(featuredPhotoCID)
		}
	},
	methods: {
		saveCaption(): void {
			// save caption to draft state
			this.$store.commit(`draft/updateFeaturedPhotoCaption`, this.caption)
		},
		handlePost(): void {
			this.$emit(`post`)
		},
		addTag(): void {
			if (!this.$qualityText(this.tag) || this.tag.length < 1 || this.tag.length > 99) {
				this.$toastError(`Invalid tag!`)
				return
			}
			if (this.tag.replace(/\s/, ``).trim() !== this.tag) {
				this.$toastError(`Tag with spaces is not allowed`)
				return
			}
			const { tags } = this.$store.state.draft.drafts[this.$store.state.draft.activeIndex]
			if (tags.length > 2) {
				this.$toastWarning(`Max: 3 tags`)
				return
			}
			if (tags.some((t: Tag) => t.name === this.tag)) {
				this.$toastWarning(`Duplicate tag!`)
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
			this.caption = ``
			this.$store.commit(`draft/updateFeaturedPhotoCaption`, null)
			this.$store.commit(`draft/updateFeaturedPhotoCID`, null)
		},
		async uploadImage(image: any, blobImage: Blob): Promise<void> {
			const cid = await addPhotoToIPFS(image)
			await preUploadPhoto(cid, blobImage)
			this.$store.commit(`draft/updateFeaturedPhotoCID`, cid)
			this.downloadImage(cid)
		},
		async downloadImage(cid: string): Promise<void> {
			this.featuredPhoto = await getPhotoFromIPFS(cid)
		},
		handleUploadImageClick(): void {
			if (this.$refs.featuredPhoto) {
				// @ts-ignore
				const element: HTMLInputElement = this.$refs.featuredPhoto
				element.click()
			}
		},
		async handleImage(e: Event): Promise<void> {
			const target = e.target as HTMLInputElement
			const image: File = (target.files as FileList)[0]
			if (!image) {
				return
			}
			try {
				const compressedImage = await imageCompression(image, {
					maxSizeMB: 5,
					maxWidthOrHeight: 1920,
					useWebWorker: true,
					initialQuality: 0.9,
				})
				const reader = new FileReader()
				reader.readAsDataURL(compressedImage)
				reader.onload = (i) => {
					if (i.target !== null) {
						this.uploadImage(i.target.result, compressedImage)
					}
				}
			} catch (err) {
				this.$toastError(`error`)
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
	},
})
</script>
