<template>
	<section v-if="profile !== null" class="px-4">
		<article>
			<div v-for="p in profiles" :key="p.id">
				<nuxt-link class="text-primary underline" :to="'/' + p.id">
					{{ p }}
				</nuxt-link>
			</div>
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import { getFollowersAndFollowing } from '@/backend/following'
import { getProfile } from '@/backend/profile'
interface IData {
	isLoading: boolean
	profiles: any
}

export default Vue.extend({
	props: {
		profile: {
			type: Object,
			default: null,
		},
	},
	data(): IData {
		return {
			isLoading: true,
			profiles: [],
		}
	},
	async created() {
		const res = await getFollowersAndFollowing(this.$route.params.id)
		const followers = res.followers
		followers.forEach(this.getFollowers)
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
