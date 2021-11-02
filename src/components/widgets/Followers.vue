<template>
	<article class="w-full rounded-lg shadow-lg bg-white mb-5 p-4">
		<h6 class="font-semibold text-primary mb-2">Recent Followers</h6>
		<div v-for="p in profiles" :key="p.id">
			<ProfilePreview :profile="p" :updateFollowers="updateFollowers" class="pb-4" />
		</div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import ProfilePreview from '@/components/ProfilePreview.vue'
import { Profile, getProfile } from '@/backend/profile'

interface IData {
	profiles: Array<Profile>
}

export default Vue.extend({
	components: {
		ProfilePreview,
	},
	props: {
		followers: {
			type: Set,
			required: true,
		},
		updateFollowers: {
			type: Function as PropType<() => void>,
			required: true,
		},
	},
	data(): IData {
		return {
			profiles: [],
		}
	},
	mounted() {
		this.$props.followers.forEach(this.getFollowers)
	},
	methods: {
		async getFollowers(p: string) {
			const profile = await getProfile(p)
			if (profile) {
				this.profiles.push(profile)
			}
		},
	},
})
</script>