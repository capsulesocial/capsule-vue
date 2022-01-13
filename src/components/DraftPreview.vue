<template>
	<div class="flex flex-row justify-between my-4 items-center">
		<!-- Title -->
		<div class="flex flex-col flex-grow">
			<h6 class="text-base font-semibold">{{ draft.title === `` ? `New Post` : draft.title }}</h6>
			<p class="text-sm text-gray5">Last saved {{ $formatDate(draft.timestamp) }}</p>
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
		<div class="icon flex items-center relative">
			<button class="focus:outline-none ml-2 text-gray5" @click.stop="toggleDropdownDelete">
				<MoreIcon />
			</button>
			<div
				v-show="showDelete"
				:class="
					$store.state.settings.darkMode
						? 'bg-lightBG text-lightPrimaryText border-lightBorder'
						: 'bg-darkBG text-darkPrimaryText border-darkBorder'
				"
				class="absolute flex flex-col rounded-lg w-40 shadow-lg z-10 p-2 modal-animation dropdownDraftOpen"
				style="top: 35px; right: -5px"
			>
				<button class="flex focus:outline-none text-primary mb-2" @click="setActiveDraft(draft)">
					<PencilIcon class="fill-current p-1" />
					<span class="text-sm self-center text-primary ml-1">Edit this draft</span>
				</button>
				<!-- Delete -->
				<button class="flex focus:outline-none text-negative" @click="deleteDraft(draft)">
					<BinIcon class="p-1" />
					<span class="text-sm self-center text-negative ml-1">Delete this draft</span>
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
import MoreIcon from '@/components/icons/More.vue'
import BinIcon from '@/components/icons/Bin.vue'

import { getPhotoFromIPFS } from '@/backend/photos'
import { Post } from '@/backend/post'

type DraftPost = Omit<Post, `authorID`>

interface IData {
	featuredPhoto: any
	showDelete: boolean
	delayActiveDraft: boolean
}

export default Vue.extend({
	components: {
		PencilIcon,
		ImageIcon,
		BinIcon,
		MoreIcon,
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
			delayActiveDraft: false,
		}
	},
	async created() {
		if (this.draft.featuredPhotoCID) {
			this.featuredPhoto = await getPhotoFromIPFS(this.draft.featuredPhotoCID)
		}
		window.addEventListener(`click`, this.handleDropdown, false)
	},
	destroyed() {
		if (this.delayActiveDraft) {
			this.$store.commit(`draft/setActiveDraft`, this.index)
		}
	},
	methods: {
		setActiveDraft() {
			if (this.$route.name === `post`) {
				location.reload()
				this.$store.commit(`draft/setActiveDraft`, this.index)
				return
			}
			// Prevent overwriting of selected draft
			if (this.$store.state.widgets.primary === `editor` && this.$route.name === `home`) {
				this.$router.push(`/post`)
				this.delayActiveDraft = true
				return
			}
			this.$router.push(`/post`)
			this.$store.commit(`draft/setActiveDraft`, this.index)
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
<style>
.dropdownDraftOpen::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 0.5rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
}
</style>
