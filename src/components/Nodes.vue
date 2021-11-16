<template>
	<!-- Peered nodes -->
	<div class="flex items-center bg-gray1 px-3 rounded-lg">
		<span class="text-sm mr-1 text-gray5">{{ nodes }} peered nodes</span>
		<CapsuleIcon :shrink="true" />
		<span class="bg-connectGreen rounded-xl w-3 h-3"></span>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import CapsuleIcon from '@/components/icons/Capsule.vue'
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
