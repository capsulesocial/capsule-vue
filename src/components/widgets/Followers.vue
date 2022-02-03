<template>
	<article
		class="from-lightBGStart to-lightBGStop border-lightBorder mb-5 w-full rounded-lg border bg-gradient-to-r p-4 pt-3 shadow-lg"
		style="backdrop-filter: blur(10px)"
	>
		<h6 class="text-primary mb-4 font-semibold">Recent Followers</h6>
		<article v-if="profiles.length == 0">
			<p class="text-gray5 mb-5 mt-3 text-sm">
				<span> It seems no one is following you yet </span>
			</p>
		</article>
		<div v-for="p in profiles" :key="p.id">
			<ProfilePreview :profile="p" :updateFollowers="updateFollowers" class="pb-4" />
		</div>
		<nuxt-link
			:to="
				this.$route.name === `home`
					? `/id/` + this.$store.state.session.id + `/followers`
					: `/id/` + this.$route.params.id + `/followers`
			"
			class="text-primary text-sm"
			>Show more</nuxt-link
		>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import ProfilePreview from '@/components/ProfilePreview.vue'
import { Profile, getProfile } from '@/backend/profile'

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
			this.profiles = []
			const followers = Array.from(fList)
			const list = followers.slice(0, 3)
			list.forEach(this.getFollowers)
		},
		async getFollowers(p: string) {
			const { profile } = await getProfile(p)
			if (profile) {
				this.profiles.push(profile)
			}
		},
	},
})
</script>
