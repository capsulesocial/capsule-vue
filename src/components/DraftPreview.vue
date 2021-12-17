<template>
	<div class="flex flex-row justify-between my-4 items-center">
		<!-- Title -->
		<div class="flex flex-col flex-grow">
			<h6 class="text-base font-semibold">{{ draft.title === `` ? `New Post` : draft.title }}</h6>
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
			<button class="p-3 bg-primary text-white rounded-lg" @click="setActiveDraft">
				<PencilIcon class="fill-current w-5 h-5 p-" />
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'

import PencilIcon from '@/components/icons/Pencil.vue'
import ImageIcon from '@/components/icons/Image.vue'

import { getPhotoFromIPFS } from '@/backend/photos'
import { Post } from '@/backend/post'

type DraftPost = Omit<Post, `authorID`>

interface IData {
	featuredPhoto: any
}

export default Vue.extend({
	components: {
		PencilIcon,
		ImageIcon,
	},
	props: {
		draft: {
			type: Object as PropType<DraftPost>,
			required: true,
		},
		index: {
			type: Number,
			required: true,
		},
	},
	data(): IData {
		return {
			featuredPhoto: null,
		}
	},
	async created() {
		if (this.$props.draft.featuredPhotoCID) {
			this.featuredPhoto = await getPhotoFromIPFS(this.$props.draft.featuredPhotoCID)
		}
	},
	methods: {
		setActiveDraft() {
			this.$store.commit(`draft/setActiveDraft`, this.$props.index)
			this.$router.push(`/post`)
		},
	},
})
</script>
