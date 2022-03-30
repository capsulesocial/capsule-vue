<template>
	<div>
		<article v-if="loading">
			<div class="loader"></div>
		</article>
		<article v-if="imageError">
			<div class="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
				{{ imageError }}
			</div>
		</article>
		<article v-else>
			<img :src="image" :alt="cid" class="ipfs-image" @click="openImagePopup = true" />
			<portal to="postPage">
				<ImagePopup v-if="openImagePopup" :image="image" @close="openImagePopup = false" />
			</portal>
		</article>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import ImagePopup from '@/components/popups/Image.vue'

interface IData {
	image: null | string
	loading: boolean
	imageError: null | string
	openImagePopup: boolean
}

export default Vue.extend({
	name: `IpfsImage`,
	components: {
		ImagePopup,
	},
	props: {
		cid: { type: String, required: true },
	},
	data(): IData {
		return {
			image: null,
			loading: true,
			imageError: null,
			openImagePopup: false,
		}
	},
	created() {
		getPhotoFromIPFS(this.cid)
			.then((p) => {
				this.image = p
				this.loading = false
			})
			.catch((error) => {
				this.loading = false
				this.imageError = `error malformed image`
				this.$toastError(error)
			})
	},
})
</script>

<style scoped>
.ipfs-image {
	display: block;
	margin-left: auto;
	margin-right: auto;
	width: 100%;
	margin-top: 10px;
	margin-bottom: 10px;
}
</style>
