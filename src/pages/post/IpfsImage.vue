<template>
	<div>
		<article v-if="loading">
			<div class="loader"></div>
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
		}
	},
	created() {
		getPhotoFromIPFS(this.cid).then((p) => {
			this.image = p
			this.loading = false
		})
	},
})
</script>
