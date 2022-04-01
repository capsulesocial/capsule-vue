<template>
	<div class="relative">
		<!-- Peered nodes -->
		<div
			class="bg-gray1 dark:bg-gray7 items-center rounded-lg px-3 flex h-9"
			@mouseenter="showInfo = true"
			@mouseleave="showInfo = false"
		>
			<span v-if="initIPFS" class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation">Initialising IPFS...</span>
			<span v-else-if="initNodes" class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation"
				>Connecting to peers...</span
			>
			<span v-else class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation">{{ nodes }} peered nodes</span>
			<CapsuleIcon v-if="!initNodes" :shrink="true" class="text-darkBG dark:text-gray2 modal-animation" />
			<span v-if="initNodes" class="ml-1 flex h-3 w-3 modal-animation">
				<span class="absolute inline-flex h-3 w-3 animate-ping rounded-full opacity-75 bg-gray5 dark:bg-gray3"></span>
				<span class="relative inline-flex h-3 w-3 rounded-full bg-gray5 dark:bg-gray3"></span>
			</span>
			<span v-else class="ml-1 flex h-3 w-3 modal-animation">
				<span
					class="absolute inline-flex h-3 w-3 animate-ping rounded-full opacity-75"
					:class="nodes > 5 ? `bg-positive` : `bg-neutral`"
				></span>
				<span
					class="relative inline-flex h-3 w-3 rounded-full"
					:class="nodes > 5 ? `bg-positive` : `bg-neutral`"
				></span>
			</span>
		</div>
		<!-- Info hover -->
		<div
			v-show="showInfo"
			class="absolute z-10 border-lightBorder modal-animation rounded-lg border bg-lightBG dark:bg-gray7 p-2 shadow-lg text-gray5 dark:text-gray1 self-center text-xs"
			:class="$colorMode.dark ? `NodesInfoOpenDark` : `NodesInfoOpen`"
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
	initNodes: boolean
	initIPFS: boolean
	showInfo: boolean
}

export default Vue.extend({
	components: {
		CapsuleIcon,
	},
	data(): IData {
		return {
			nodes: 0,
			initNodes: true,
			initIPFS: true,
			showInfo: false,
		}
	},
	created() {
		ipfs().initResult.then(async () => {
			this.initIPFS = false
			await this.update()
			this.updateLoop()
		})
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
			if (this.initNodes && nodes !== 0) {
				this.initNodes = false
			}
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
