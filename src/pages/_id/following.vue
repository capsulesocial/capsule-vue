<template>
	<section v-if="profile !== null" class="p-4">
		<article>
			<div v-for="p in profiles" :key="p.id">
				<ProfilePreview :profile="p" class="pb-4" />
			</div>
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import ProfilePreview from '@/components/ProfilePreview.vue'
import { getFollowersAndFollowing } from '@/backend/following'
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
		const following = res.following
		following.forEach(this.getFollowing)
	},
	methods: {
		async getFollowing(p: string) {
			const profile = await getProfile(p)
			if (profile) {
				this.profiles.push(profile)
			}
		},
	},
})
</script>
