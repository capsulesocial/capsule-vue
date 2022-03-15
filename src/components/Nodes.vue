<template>
	<div class="relative">
		<!-- Peered nodes -->
		<div
			class="bg-gray1 dark:bg-gray7 items-center rounded-lg px-3 flex"
			@mouseenter="showInfo = true"
			@mouseleave="showInfo = false"
		>
			<span class="text-gray5 dark:text-gray1 mr-1 text-sm">{{ nodes }} peered nodes</span>
			<CapsuleIcon :shrink="true" class="text-primary dark:text-gray1" />
			<span class="ml-1 flex h-3 w-3">
				<span
					class="absolute inline-flex h-3 w-3 animate-ping rounded-full opacity-75"
					:class="nodes > 5 ? `bg-connectGreen` : `bg-connectOrange`"
				></span>
				<span
					class="relative inline-flex h-3 w-3 rounded-full"
					:class="nodes > 5 ? `bg-connectGreen` : `bg-connectOrange`"
				></span>
			</span>
		</div>
		<!-- Info hover -->
		<div
			v-show="showInfo"
			class="absolute z-10 border-lightBorder modal-animation rounded-lg border bg-lightBG dark:bg-gray7 p-2 shadow-lg text-gray5 dark:text-gray1 self-center text-xs"
			:class="dark ? `NodesInfoOpenDark` : `NodesInfoOpen`"
			style="top: -5px; right: 205px; width: 140%"
		>
			Number of hosts on Blogchain's public network currently in use to serve content
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import CapsuleIcon from '@/components/icons/CapsuleNew.vue'
import ipfs from '@/backend/utilities/ipfs'

export interface IData {
	nodes: number
	showInfo: boolean
	dark: boolean
}

export default Vue.extend({
	components: {
		CapsuleIcon,
	},
	data(): IData {
		return {
			nodes: 0,
			showInfo: false,
			dark: false,
		}
	},
	created() {
		if (document.documentElement.classList.contains(`dark`)) {
			this.dark = true
		} else {
			this.dark = false
		}
		this.update()
		this.updateLoop()
	},
	methods: {
		updateLoop() {
			setTimeout(async () => {
				await this.update()
				this.updateLoop()
			}, 1000)
		},
		async update() {
			const nodes = await ipfs().getNodes()
			this.nodes = nodes
		},
	},
})
</script>
<style>
.NodesInfoOpen::before {
	content: '';
	position: absolute;
	top: 1rem;
	right: -0.5rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
	z-index: 1;
}
.NodesInfoOpenDark::before {
	content: '';
	position: absolute;
	top: 1rem;
	right: -0.5rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #686868;
	border-radius: 2px;
	z-index: 1;
}
</style>
