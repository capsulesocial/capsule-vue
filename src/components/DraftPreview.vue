<template>
	<div
		v-if="draft.title !== `` || draft.subtitle !== `` || draft.content !== ``"
		class="my-4 flex flex-row items-center justify-between cursor-pointer"
	>
		<!-- Title -->
		<button class="flex flex-grow flex-col overflow-hidden focus:outline-none" @click="setActiveDraft(draft)">
			<h6
				class="truncate text-base font-semibold dark:text-darkPrimaryText"
				:style="$route.name === `home` && inWidget ? `max-width: 259px` : `max-width: 390px`"
			>
				{{ draft.title === `` ? `New Post` : draft.title }}
			</h6>
			<p v-if="draft.timestamp !== 0" class="text-gray5 dark:text-gray3 text-sm">
				Last saved {{ $formatDate(draft.timestamp) }}
			</p>
			<p v-else class="text-gray5 dark:text-gray3 text-sm">Active</p>
		</button>
		<!-- Featured image -->
		<button
			class="mx-4 w-24 flex-shrink-0 items-center focus:outline-none"
			:class="inWidget ? `hidden xl:flex` : `flex`"
			@click="setActiveDraft"
		>
			<img
				v-if="featuredPhoto !== null"
				:src="featuredPhoto"
				alt="$store.state.draft.title"
				class="h-16 w-full flex-shrink-0 rounded-lg object-cover"
			/>
			<span
				v-else
				class="bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray2 flex h-16 w-24 items-center justify-center rounded-lg"
			>
				<ImageIcon class="h-5 w-5 fill-current" />
			</span>
		</button>
		<div class="icon relative flex items-center">
			<button class="focus:outline-none text-gray5 dark:text-gray3 ml-2" @click.stop="toggleDropdownDelete">
				<MoreIcon />
			</button>
			<div
				v-show="showDelete"
				class="bg-lightBG dark:bg-darkBG dark:text-darkPrimaryText text-lightPrimaryText border-lightBorder modal-animation absolute z-10 flex w-40 flex-col rounded-lg border p-2 shadow-lg"
				:class="$colorMode.dark ? `dropdownDraftOpenDark` : `dropdownDraftOpen`"
				style="top: 35px; right: -5px"
			>
				<button class="focus:outline-none text-primary flex" @click="setActiveDraft">
					<PencilIcon class="fill-current p-1" />
					<span class="text-primary ml-1 self-center text-sm">Edit this draft</span>
				</button>
				<!-- Delete -->
				<button class="focus:outline-none text-negative mt-2 flex" @click="deleteDraft(draft)">
					<BinIcon class="p-1" />
					<span class="text-negative ml-1 self-center text-sm">Delete this draft</span>
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

import { getPhotoFromIPFS } from '@/backend/getPhoto'
import { Post } from '@/backend/post'

type DraftPost = Omit<Post, `authorID`>

interface IData {
	featuredPhoto: unknown
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
		numberOfDrafts: {
			type: Number,
			default: 0,
		},
		inWidget: {
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
			// drafts popup on editor
			if (this.$route.name === `post`) {
				this.$store.commit(`draft/setActiveDraft`, this.index)
				this.$emit(`closeDraftsPopup`)
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
.dropdownDraftOpenDark::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 0.5rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #121212;
	border-radius: 2px;
}
</style>
