<template>
	<article class="p-6 pt-4 pb-4">
		<h3 class="text-primary font-semibold">Drafts</h3>
		<div class="flex flex-row justify-between my-4 items-center">
			<!-- Title -->
			<div class="flex flex-col flex-grow">
				<h6 class="text-base font-semibold">
					{{ $store.state.draft.title === `` ? `New Post` : $store.state.draft.title }}
				</h6>
				<p class="text-sm text-gray5">Last saved __ ago</p>
			</div>
			<!-- Featured image -->
			<div class="flex flex-shrink-0 items-center mx-4">
				<img
					v-if="featuredPhoto !== null"
					:src="featuredPhoto"
					alt="$store.state.draft.title"
					class="h-16 w-20 rounded-lg"
				/>
				<span v-else class="h-16 w-20 bg-gray1 text-gray5 rounded-lg flex items-center justify-center">
					<ImageIcon class="w-5 h-5 fill-current" />
				</span>
			</div>
			<div class="flex items-center">
				<nuxt-link to="/post" class="p-3 bg-primary text-white rounded-lg">
					<PencilIcon class="fill-current w-5 h-5 p-" />
				</nuxt-link>
			</div>
		</div>
		<p class="text-primary">
			<span class="text-sm">Show all</span>
		</p>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import PencilIcon from '@/components/icons/Pencil.vue'
import ImageIcon from '@/components/icons/Image.vue'

import { getPhotoFromIPFS } from '@/backend/photos'

interface IData {
	featuredPhoto: any
}

export default Vue.extend({
	components: {
		PencilIcon,
		ImageIcon,
	},
	data(): IData {
		return {
			featuredPhoto: null,
		}
	},
	async created() {
		if (this.$store.state.draft.featuredPhotoCID) {
			this.featuredPhoto = await getPhotoFromIPFS(this.$store.state.draft.featuredPhotoCID)
		}
	},
	methods: {
		getPhotoFromIPFS,
	},
})
</script>