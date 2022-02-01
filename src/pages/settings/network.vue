<template>
	<main>
		<!-- Mobile back button -->
		<nuxt-link to="/settings" class="mb-4 block flex items-center xl:hidden">
			<span class="bg-gray1 mr-2 rounded-full p-1"><ChevronLeft /></span>
			<h6 class="font-semibold">All Settings</h6>
		</nuxt-link>
		<!-- Network Tab -->
		<h2 class="text-primary mb-4 text-sm font-semibold">Capsule Node</h2>
		<p class="text-gray5 mb-6">
			Blogchain relies on the Capsule network technology composed of multiple nodes. You can choose to connect and
			interact with a trusted node or one close by geographically<br />By default, you will be connected to the closest
			node. one.
		</p>
		<div class="mb-6 flex w-full flex-col xl:flex-row xl:items-center">
			<label for="node" class="mb-2 w-48 font-semibold xl:mb-0">Preferred Node:</label>
			<input
				id="node"
				v-model="nodeURL"
				type="text"
				:placeholder="``"
				class="bg-gray1 text-gray5 placeholder-gray5 focus:outline-none flex-grow rounded-lg px-2 py-1"
			/>
			<button class="focus:outline-none w-48"></button>
		</div>
		<!-- Submit button -->
		<div class="flex w-full justify-end">
			<button
				:class="hasChanged() ? '' : 'opacity-50'"
				class="bg-primary focus:outline-none rounded-lg px-4 py-2 text-white"
				@click="updateSettings"
			>
				Save Changes
			</button>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import ChevronLeft from '@/components/icons/ChevronLeft.vue'

interface IData {
	nodeURL: string
}

export default Vue.extend({
	components: { ChevronLeft },
	layout: `settings`,
	props: {
		tab: {
			type: String,
			required: true,
		},
	},
	data(): IData {
		return {
			nodeURL: ``,
		}
	},
	head() {
		return {
			title: `Network settings - Capsule Social`,
			meta: [{ hid: `settings-network`, name: `settings-network`, content: `Network settings on Capsule Social` }],
		}
	},
	created() {
		const nodeUrl = window.localStorage.getItem(`preferredNodeUrl`)
		if (nodeUrl) {
			this.nodeURL = nodeUrl
		}
	},
	methods: {
		hasChanged(): boolean {
			return this.nodeURL !== ``
		},
		updateSettings() {
			if (this.nodeURL !== ``) {
				window.localStorage.setItem(`preferredNodeUrl`, this.nodeURL)
				window.location.href = `..`
				this.$toastSuccess(`Preferred node URL updated`)
			}
		},
	},
})
</script>
