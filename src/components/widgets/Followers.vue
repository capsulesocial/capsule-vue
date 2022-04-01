<template>
	<article
		class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder mb-5 w-full rounded-lg border bg-gradient-to-r p-4 shadow-lg"
		style="backdrop-filter: blur(10px)"
	>
		<h6 class="text-lightPrimaryText dark:text-darkPrimaryText mb-4 font-semibold">Recent Followers</h6>
		<article v-if="profiles.length == 0">
			<p class="text-gray5 dark:text-gray3 mb-5 mt-3 text-sm">
				<span> It seems no one is following you yet </span>
			</p>
		</article>
		<div v-for="p in profiles" :key="p.id">
			<ProfilePreview :profile="p" :updateFollowers="updateFollowers" class="pb-4" />
		</div>
		<button class="text-primary text-sm" @click="$emit(`openFollowers`)">Show more</button>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import ProfilePreview from '@/components/ProfilePreview.vue'
import { Profile, getProfile, createDefaultProfile } from '@/backend/profile'

interface IData {
	profiles: Array<Profile>
	route: string
}

export default Vue.extend({
	components: {
		ProfilePreview,
	},
	props: {
		followers: {
			type: Set as PropType<Set<string>>,
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
			route: ``,
		}
	},
	watch: {
		followers(newValue) {
			this.handleProfiles(newValue)
		},
	},
	mounted() {
		// Only display the most recent three followers
		this.handleProfiles(this.followers)
	},
	methods: {
		handleProfiles(fList: Set<string>) {
			const followers = Array.from(fList)
			const list = followers.slice(0, 3)
			this.profiles = []
			list.forEach(this.getFollowers)
		},
		async getFollowers(p: string) {
			let profile = createDefaultProfile(p)
			const fetchedProfile = await getProfile(p)
			if (fetchedProfile.profile) {
				profile = fetchedProfile.profile
			}
			if (profile && !this.profiles.some((e) => e.id === profile.id)) {
				this.profiles.push(profile)
			}
		},
	},
})
</script>
