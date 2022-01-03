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
		<div class="icon flex items-center">
			<button class="p-3 bg-primary text-white rounded-lg" @click="setActiveDraft">
				<PencilIcon class="fill-current w-5 h-5 p-" />
			</button>
			<button
				v-if="displayDeleteButton"
				class="icon p-3 bg-negative text-white rounded-lg ml-4 focus:outline-none"
				style="padding-left: 0.88rem"
				@click="toggleDropdownDelete"
			>
				<BinIcon class="icon fill-current w-5 h-5" />
			</button>
			<div
				v-show="showDelete"
				:class="
					$store.state.settings.darkMode
						? 'bg-lightBG text-lightPrimaryText border-lightBorder'
						: 'bg-darkBG text-darkPrimaryText border-darkBorder'
				"
				class="absolute flex flex-col rounded-lg w-32 shadow-lg z-10 p-1 modal-animation"
				style="top: 80px; right: 0px"
			>
				<!-- Delete -->
				<button class="flex focus:outline-none text-negative" @click="deleteDraft(draft)">
					<BinIcon class="p-1" />
					<span class="text-xs self-center text-negative">Delete this draft</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'

import PencilIcon from '@/components/icons/Pencil.vue'
import ImageIcon from '@/components/icons/Image.vue'
import BinIcon from '@/components/icons/Bin.vue'

import { getPhotoFromIPFS } from '@/backend/photos'
import { Post } from '@/backend/post'

type DraftPost = Omit<Post, `authorID`>

interface IData {
	featuredPhoto: any
	showDelete: boolean
}

export default Vue.extend({
	components: {
		PencilIcon,
		ImageIcon,
		BinIcon,
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
		displayDeleteButton: {
			type: Boolean,
			default: false,
		},
	},
	data(): IData {
		return {
			featuredPhoto: null,
			showDelete: false,
		}
	},
	async created() {
		if (this.$props.draft.featuredPhotoCID) {
			this.featuredPhoto = await getPhotoFromIPFS(this.$props.draft.featuredPhotoCID)
		}
		if (this.$props.displayDeleteButton) {
			window.addEventListener(`click`, this.handleDropdown, false)
		}
	},
	methods: {
		setActiveDraft() {
			if (this.$route.name === `post`) {
				location.reload()
				this.$store.commit(`draft/setActiveDraft`, this.$props.index)
				return
			}
			this.$store.commit(`draft/setActiveDraft`, this.$props.index)
			this.$router.push(`/post`)
		},
		toggleDropdownDelete() {
			this.showDelete = !this.showDelete
		},
		deleteDraft(d: any): void {
			const i: number = this.$store.state.draft.drafts.indexOf(d)
			this.$store.commit(`draft/deleteDraft`, i)
		},
		handleDropdown(e: any): void {
			if (!e.target || e.target.parentNode === null || e.target.parentNode.classList === undefined) {
				return
			}
			if (!e.target.parentNode.classList.contains(`icon`)) {
				this.showDelete = false
			}
		},
	},
})
</script>
