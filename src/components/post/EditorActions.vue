<template>
	<div class="flex items-end">
		<button
			class="focus:outline-none hover:text-primary dark:hover:text-secondary toggle flex items-end"
			:class="showSocialShares ? 'text-primary dark:text-secondary' : ''"
			@click.stop="toggleDropdown"
		>
			<div class="text-gray3 hover:text-primary dark:hover:text-secondary hover:fill-primary flex">
				<PlusIcon :isActive="showSocialShares" style="transform: scale(1.2); margin-top: -1px" />
			</div>
		</button>
		<div
			v-show="showSocialShares"
			class="bg-lightBG dark:bg-darkBG text-lightPrimaryText dark:text-darkPrimaryText border-lightBorder modal-animation dropdownActionsOpen absolute z-10 flex flex-col rounded-lg border p-3 shadow-lg"
			style="left: 50px; top: -12px"
		>
			<!-- Add Image -->
			<button
				class="focus:outline-none text-gray5 dark:text-gray3 flex hover:text-lightPrimaryText dark:hover:text-darkPrimaryText"
				@click="$emit(`image`)"
			>
				<ImageIcon class="h-5 w-5 fill-current" />
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import PlusIcon from '@/components/icons/Plus.vue'
import ImageIcon from '@/components/icons/Image.vue'

interface IData {
	showSocialShares: boolean
}

export default Vue.extend({
	components: {
		PlusIcon,
		ImageIcon,
	},
	data(): IData {
		return {
			showSocialShares: false,
		}
	},
	created() {
		window.addEventListener(
			`click`,
			(e: any): void => {
				if (!e.target) {
					return
				}
				if (
					e.target.parentNode === null ||
					e.target.parentNode.classList === undefined ||
					!e.target.parentNode.classList.contains(`toggle`)
				) {
					this.showSocialShares = false
				}
			},
			false,
		)
	},
	methods: {
		toggleDropdown() {
			this.showSocialShares = !this.showSocialShares
		},
	},
})
</script>
<style>
.dropdownActionsOpen::before {
	content: '';
	position: absolute;
	top: 0.85rem;
	left: -0.5rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
}
</style>
