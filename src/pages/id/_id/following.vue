<template>
	<section v-if="profile !== null" class="p-6">
		<article v-if="profiles.length == 0" class="grid justify-items-center mt-32">
			<p class="text-sm text-gray5 mb-5 text-center">
				<span v-if="$route.params.id === $store.state.session.id">
					It seems you don't have any followers yet!<br />
				</span>
			</p>
			<SecondaryButton
				v-if="$store.state.session.id === $route.params.id"
				:text="`Discover new content`"
				:action="toggleDiscover"
			/>
		</article>
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
import { getFollowersAndFollowing } from '@/backend/following'
import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
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
			type: Object as PropType<Profile | null>,
			default: null,
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
	async created() {
		const res = await getFollowersAndFollowing(this.$route.params.id)
		const following = res.following
		following.forEach(this.getFollowing)
	},
	methods: {
		async getFollowing(p: string) {
			let profile = createDefaultProfile(p)
			const { profile: fetchedProfile } = await getProfile(p)
			if (fetchedProfile) {
				profile = fetchedProfile
			}
			this.profiles.push(profile)
		},
		toggleDiscover() {
			this.$router.push(`/discover`)
		},
	},
})
</script>
