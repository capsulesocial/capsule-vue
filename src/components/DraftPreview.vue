<template>
	<div
		v-if="draft.title !== `` || draft.subtitle !== `` || draft.content !== ``"
		class="my-4 flex flex-row items-center justify-between"
	>
		<!-- Title -->
		<div class="flex flex-grow flex-col">
			<h6
				class="truncate text-base font-semibold"
				:style="$route.name === `home` ? `max-width: 259px` : `max-width: 408px`"
			>
				{{ draft.title === `` ? `New Post` : draft.title }}
			</h6>
			<p v-if="draft.timestamp !== 0" class="text-gray5 text-sm">Last saved {{ $formatDate(draft.timestamp) }}</p>
			<p v-else class="text-gray5 text-sm">No save</p>
		</div>
		<!-- Featured image -->
		<div class="mx-4 flex flex-shrink-0 items-center">
			<img
				v-if="featuredPhoto !== null"
				:src="featuredPhoto"
				alt="$store.state.draft.title"
				class="h-16 w-20 rounded-lg"
			/>
			<span v-else class="bg-gray1 text-gray5 flex h-16 w-20 items-center justify-center rounded-lg">
				<ImageIcon class="h-5 w-5 fill-current" />
			</span>
		</div>
		<div class="icon relative flex items-center">
			<button class="focus:outline-none text-gray5 ml-2" @click.stop="toggleDropdownDelete">
				<MoreIcon />
			</button>
			<div
				v-show="showDelete"
				:class="
					$store.state.settings.darkMode
						? 'bg-lightBG text-lightPrimaryText border-lightBorder'
						: 'bg-darkBG text-darkPrimaryText border-darkBorder'
				"
				class="border-lightBorder modal-animation dropdownDraftOpen absolute z-10 flex w-40 flex-col rounded-lg border p-2 shadow-lg"
				style="top: 35px; right: -5px"
			>
				<button class="focus:outline-none text-primary flex" @click="setActiveDraft(draft)">
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
		numberOfDrafts: {
			type: Number,
			default: 0,
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
