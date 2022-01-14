<template>
	<main>
		<!-- Network Tab -->
		<h2 class="text-primary font-semibold mb-4 text-sm">Capsule Node</h2>
		<p class="text-gray5 mb-6">
			Blogchain rely on the Capsule network technology composed of multiple nodes. You can choose to connect and
			interact with a trusted node or a geographically close-by one. <br />Leaving it by default will chose the closest
			one.
		</p>
		<div class="flex flex-row items-center w-full mb-6">
			<label for="node" class="w-48 font-semibold">Preferred Node:</label>
			<input
				id="node"
				v-model="nodeURL"
				type="text"
				:placeholder="``"
				class="flex-grow bg-gray1 text-gray5 placeholder-gray5 rounded-lg px-2 py-1 focus:outline-none"
			/>
			<button class="w-48 focus:outline-none"></button>
		</div>
		<!-- Submit button -->
		<div class="w-full flex justify-end">
			<button
				:class="hasChanged() ? '' : 'opacity-50'"
				class="bg-primary text-white rounded-lg focus:outline-none px-4 py-2"
				@click="updateSettings"
			>
				Save Changes
			</button>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'

interface IData {
	nodeURL: string
}

export default Vue.extend({
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
	created() {
		const nodeUrl = window.localStorage.getItem(`preferredNodeUrl`)
		if (nodeUrl) {
			this.nodeURL = nodeUrl
		}
	},
	methods: {
		hasChanged() {
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
