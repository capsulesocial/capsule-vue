<template>
	<article class="p-4">
		<h5 class="text-primary font-semibold">Drafts</h5>
		<div class="flex flex-row justify-between">
			<!-- Title -->
			<div class="flex flex-col flex-grow">
				<h6 class="text-lg font-semibold">
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
					class="h-16 rounded-lg"
				/>
			</div>
			<div class="flex items-center">
				<nuxt-link to="/post" class="p-2 bg-primary text-white rounded-lg">
					<PencilIcon class="fill-current" />
				</nuxt-link>
			</div>
		</div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import PencilIcon from '@/components/icons/Pencil.vue'

import { getPhotoFromIPFS } from '@/backend/photos'

interface IData {
	featuredPhoto: any
}

export default Vue.extend({
	components: {
		PencilIcon,
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