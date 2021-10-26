<template>
	<div class="">
		<!-- Featured image -->
		<article class="rounded-lg shadow-lg bg-white p-4 mb-5">
			<h6 class="text-primary font-semibold">Featuerd Image</h6>
			<button class="w-full focus:outline-none" @click="handleUploadImageClick">
				<input
					id="featured-photo"
					ref="featuredPhoto"
					class="hidden"
					name="photo"
					type="file"
					accept="image/*"
					@change="handleImage"
				/>
				<!-- No Photo Uploaded -->
				<div v-show="featuredPhoto === null">
					<div
						class="
							w-full
							p-4
							rounded-lg
							border-4 border-primary border-dashed
							h-24
							flex
							justify-center
							items-center
							my-2
						"
					>
						<UploadIcon />
					</div>
				</div>
				<p class="text-primary text-left font-light text-sm">Upload an Image</p>
			</button>
			<!-- Photo Uploaded -->
			<div v-if="featuredPhoto !== null">
				<img :src="featuredPhoto" class="hotzone w-full h-24 object-contain" />
				<button
					class="hotzone border border-primary text-primary focus:outline-none text-sm mt-4 p-1"
					@click="handleUploadImageClick"
				>
					Replace Image
				</button>
				<button class="hotzone my-2 text-sm underline text-lightError focus:outline-none" @click="removeImage()">
					Remove Image
				</button>
			</div>
		</article>
		<!-- Category -->
		<article class="rounded-lg shadow-lg bg-white p-4 mb-5">
			<h6 class="text-primary font-semibold">Category</h6>
			<button class="w-full p-2 my-1 rounded-lg bg-gray1" @click="showCategoryDropdown = !showCategoryDropdown">
				<div class="flex justify-between items-center">
					<div v-if="category" class="flex flex-row items-center">
						<img
							:src="require(`@/assets/images/category/` + $store.state.draft.category + `/icon.png`)"
							class="hotzone w-12 h-12 mr-2"
						/>
						<span class="text-lg">{{ $store.state.draft.category }}</span>
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
					class="w-full flex items-center px-2 capitalize focus:outline-none h-10"
					@click="changeCategory(c)"
				>
					<img :src="require(`@/assets/images/category/` + c + `/icon.png`)" class="hotzone w-6 h-6 mr-1 ml-2" />
					<span
						class="border-b ml-2"
						:class="category === c ? 'border-primary text-primary' : ' border-transparent text-lightPrimaryVariant'"
					>
						{{ c }}</span
					>
				</button>
			</div>
		</article>
		<!-- Tags -->
		<article class="rounded-lg shadow-lg bg-white p-4 mb-5">
			<h6 class="text-primary font-semibold">Tags</h6>
			<div class="w-full p-2 my-1 rounded-lg bg-gray1">
				<label for="tag" class="hidden" value="Enter hashtags"></label>
				<input
					v-model="tag"
					type="text"
					placeholder="Add a tag..."
					class="focus:outline-none bg-gray1"
					@keyup.enter="addTag"
				/>
			</div>
			<div class="flex flex-row">
				<button
					v-for="t in $store.state.draft.tags"
					:key="t.name"
					class="
						flex flex-row
						items-center
						z-10
						focus:outline-none
						pl-1
						mr-4
						mt-2
						transition
						duration-500
						ease-in-out
						transform
						hover:scale-105
						bg-gray1
						rounded-lg
					"
					@click="removeTag(t)"
				>
					<span class="font-semibold text-gray5 text-sm">{{ t.name }}</span
					><XIcon class="p-1 text-lightPrimary" />
				</button>
			</div>
		</article>
		<article class="rounded-lg shadow-lg bg-white p-4 mb-5">
			<div class="flex flex-row justify-between items-center">
				<div>
					<h5 v-show="$props.wordCount > 1">
						<span class="text-primary">{{ $props.wordCount }}</span> words
					</h5>
					<h5>Auto-save on close.</h5>
				</div>
				<BrandedButton :action="handlePost" :text="`Publish`" />
			</div>
		</article>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import imageCompression from 'browser-image-compression'
import XIcon from '@/components/icons/X.vue'
import BrandedButton from '@/components/BrandedButton.vue'
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
	showCategoryDropdown: boolean
}

export default Vue.extend({
	components: {
		XIcon,
		BrandedButton,
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
		return {
			featuredPhoto: null,
			categoryList: categories,
			category: this.$store.state.draft.category,
			tag: ``,
			showCategoryDropdown: false,
		}
	},
	mounted() {
		if (this.$store.state.draft.featuredPhotoCID !== null) {
			this.featuredPhoto = this.downloadImage(this.$store.state.draft.featuredPhotoCID)
		}
	},
	methods: {
		handlePost(): void {
			this.$emit(`post`)
		},
		addTag(): void {
			if (!this.$qualityText(this.tag) || this.tag.length < 1 || this.tag.length > 99) {
				alert(`Invalid tag!`)
				return
			}
			const tagList = this.$store.state.draft.tags
			if (tagList.some((t: Tag) => t.name === this.tag)) {
				alert(`Duplicate tag!`)
				return
			}
			if (tagList.length > 2) {
				alert(`Max: 3 tags`)
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
				alert(err)
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