<template>
	<!-- Peered nodes -->
	<div class="bg-gray1 hidden items-center rounded-lg px-3 xl:flex">
		<span class="text-gray5 mr-1 text-sm">{{ nodes }} peered nodes</span>
		<CapsuleIcon :shrink="true" />
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
