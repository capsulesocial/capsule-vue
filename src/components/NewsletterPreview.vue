<template>
	<div class="my-2 flex flex-row items-center justify-between">
		<!-- newsletter email -->
		<p class="flex items-center text-primary text-sm focus:outline-none mb-2">
			{{ newsletter.email }}
		</p>
		<div
			:class="
				newsletter.verified ? 'border-positive text-positive bg-positive' : 'border-negative text-negative bg-negative'
			"
			class="bg-positive bg-opacity-10 border rounded-2xl px-1 py-1 text-xs"
		>
			{{ newsletter.verified ? 'Active' : 'Pending ' }}
		</div>
		<!-- delete -->
		<div class="icon relative flex items-center">
			<button class="focus:outline-none text-gray5 dark:text-gray3 ml-2" @click.stop="toggleDropdownDelete">
				<MoreIcon />
			</button>
			<div
				v-show="showDelete"
				class="bg-lightBG dark:bg-darkBG dark:text-darkPrimaryText text-lightPrimaryText border-lightBorder modal-animation absolute z-10 flex w-min flex-col rounded-lg border p-2 shadow-lg"
				:class="$colorMode.dark ? `dropdownDraftOpenDark` : `dropdownDraftOpen`"
				style="top: 35px; right: -5px"
			>
				<!-- Delete -->
				<button class="focus:outline-none text-negative flex" @click="deleteNewsletter(newsletter._id)">
					<BinIcon class="p-1" />
					<span class="text-negative ml-1 self-center text-sm pr-1">Delete</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

import MoreIcon from '@/components/icons/More.vue'
import BinIcon from '@/components/icons/Bin.vue'
import { deleteSubscription } from '@/backend/emails'

interface IData {
	showDelete: boolean
}

export default Vue.extend({
	components: {
		BinIcon,
		MoreIcon,
	},
	props: {
		newsletter: {
			type: Object,
			required: true,
		},
	},
	data(): IData {
		return {
			showDelete: false,
		}
	},
	created() {
		window.addEventListener(`click`, this.handleDropdown, false)
	},
	destroyed() {
		window.removeEventListener(`click`, this.handleDropdown, false)
	},
	methods: {
		toggleDropdownDelete() {
			this.showDelete = !this.showDelete
		},
		async deleteNewsletter(id: string) {
			if (!confirm(`Confirm deleting the newsletter subscription?`)) {
				return
			}
			await deleteSubscription(this.$store.state.session.id, id)
			this.$toastSuccess(`Newsletter deleted successfully`)
			this.$emit(`subscriptionDeleted`)
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
