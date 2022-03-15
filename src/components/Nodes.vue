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
		<div v-show="showInfo" class="absolute z-10 border rounded-bl-lg rounded-br-lg bg-gray1 dark:bg-gray7 p-2 text-sm">
			Number of decentralised nodes your browser is currently connected to
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
}

export default Vue.extend({
	components: {
		CapsuleIcon,
	},
	data(): IData {
		return {
			nodes: 0,
			showInfo: false,
		}
	},
	created() {
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
