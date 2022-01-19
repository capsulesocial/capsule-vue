<template>
	<!-- Peered nodes -->
	<div class="hidden xl:flex items-center bg-gray1 px-3 rounded-lg">
		<span class="text-sm mr-1 text-gray5">{{ nodes }} peered nodes</span>
		<CapsuleIcon :shrink="true" />
		<span class="flex h-3 w-3 ml-1">
			<span
				class="animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75"
				:class="nodes > 5 ? `bg-connectGreen` : `bg-connectOrange`"
			></span>
			<span
				class="relative inline-flex rounded-full h-3 w-3"
				:class="nodes > 5 ? `bg-connectGreen` : `bg-connectOrange`"
			></span>
		</span>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import CapsuleIcon from '@/components/icons/CapsuleNew.vue'
import ipfs from '@/backend/utilities/ipfs'

export interface IData {
	nodes: number
}

export default Vue.extend({
	components: {
		CapsuleIcon,
	},
	data(): IData {
		return {
			nodes: 0,
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
