<template>
	<article
		class="w-full rounded-lg shadow-lg bg-gradient-to-r from-lightBGStart to-lightBGStop mb-5 p-4 border border-lightBorder"
		style="backdrop-filter: blur(10px)"
	>
		<h6 class="font-semibold text-primary mb-2">Recent Followers</h6>
		<article v-if="profiles.length == 0">
			<p class="text-sm text-gray5 mb-5 mt-3">
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
			class="text-sm text-primary"
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
	mounted() {
		// Only display the most recent three followers
		const followers = Array.from(this.followers)
		const list = followers.slice(0, 3)
		list.forEach(this.getFollowers)
	},
	methods: {
		async getFollowers(p: string) {
			const { profile } = await getProfile(p)
			if (profile) {
				this.profiles.push(profile)
			}
		},
	},
})
</script>
