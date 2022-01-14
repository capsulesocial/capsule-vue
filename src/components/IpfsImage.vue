<template>
	<div>
		<article v-if="loading">
			<div class="loader"></div>
		</article>
		<article v-if="imageError">
			<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
				{{ imageError }}
			</div>
		</article>
		<article v-else>
			<img :src="image" :alt="cid" />
		</article>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getPhotoFromIPFS } from '@/backend/photos'

interface IData {
	image: null | string
	loading: boolean
	imageError: null | string
}

export default Vue.extend({
	name: `IpfsImage`,
	props: {
		cid: { type: String, required: true },
	},
	data(): IData {
		return {
			image: null,
			loading: true,
			imageError: null,
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
				console.log(error)
			})
	},
})
</script>
