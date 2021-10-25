<template>
	<div class="w-full h-full overflow-y-auto">
		<!-- Featured image -->
		<article class="rounded-lg shadow-lg bg-white">
			<h6 class="text-primary font-semibold">Featuerd Image</h6>
			<button @click="handleUploadImageClick">
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
				<div v-show="featuredPhoto === null">No photo uploaded</div>
			</button>
			<!-- Photo Uploaded -->
			<div v-if="featuredPhoto !== null" class="hotzone mx-4">
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
		<article class="rounded-lg shadow-lg bg-white my-5">
			<h6 class="text-primary font-semibold">Category</h6>
			<div class="flex flex-col">
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
		<article class="rounded-lg shadow-lg bg-white mb-5">
			<div class="flex flex-row flex-nowrap bg-white py-2 mb-2 border">
				<label for="tag" class="hidden" value="Enter hashtags"></label>
				<input
					v-model="tag"
					type="text"
					placeholder="Add a tag..."
					class="w-32 pl-2 px-1 focus:outline-none"
					@keyup.enter="addTag"
				/>
			</div>
			<div class="flex flex-row">
				<button
					v-for="t in $store.state.draft.tags"
					:key="t.name"
					class="
						hotzone
						flex
						items-center
						rounded-xl
						shadow-lg
						text-primary
						bg-white
						text-sm
						pl-3
						pr-1
						mt-2
						focus:outline-none
					"
					@click="removeTag(t)"
				>
					{{ t.name }} <XIcon class="p-1 text-lightPrimary" />
				</button>
			</div>
		</article>
		<article class="rounded-lg shadow-lg bg-white mb-5">
			<div class="flex flex-row justify-between">
				<div>
					<h5>
						<span class="text-primary">{{ $props.wordCount }}</span> words
					</h5>
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

import { addPhotoToIPFS, getPhotoFromIPFS, preUploadPhoto } from '@/backend/photos'
import { categories } from '@/config'
import { Tag } from '@/backend/post'

interface IData {
	featuredPhoto: null | any
	categoryList: string[]
	category: string
	tag: string
}

export default Vue.extend({
	components: {
		XIcon,
		BrandedButton,
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
	},
})
</script>