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
import { getProfile, Profile } from '@/backend/profile'
interface IData {
	isLoading: boolean
	profiles: any
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
	mounted() {
		this.$props.followers.forEach(this.getFollowers)
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
