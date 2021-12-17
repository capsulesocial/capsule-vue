<template>
	<section v-if="profile !== null" class="p-6">
		<article>
			<div v-for="p in profiles" :key="p.id">
				<ProfilePreview :profile="p" :updateFollowers="updateFollowers" class="pb-4" />
			</div>
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import ProfilePreview from '@/components/ProfilePreview.vue'
import { getProfile } from '@/backend/profile'
interface IData {
	isLoading: boolean
	profiles: any
}
export default Vue.extend({
	components: {
		ProfilePreview,
	},
	props: {
		mutuals: {
			type: Set,
			required: true,
		},
		mutualProfiles: {
			type: Array,
			required: true,
		},
		updateFollowers: {
			type: Function as PropType<() => void>,
			required: true,
		},
	},
	data(): IData {
		return {
			isLoading: true,
			profiles: [],
		}
	},
	watch: {
		mutuals(newValue) {
			newValue.forEach(this.getMutuals)
		},
	},
	mounted() {
		this.$props.mutuals.forEach(this.getMutuals)
	},
	methods: {
		async getMutuals(p: string) {
			const profile = await getProfile(p)
			if (profile) {
				this.profiles.push(profile)
			}
		},
	},
})
</script>
