<template>
	<main>
		<!-- Mobile back button -->
		<nuxt-link to="/settings" class="mb-6 flex items-center lg:hidden">
			<span class="bg-gray1 dark:bg-gray5 mr-4 rounded-full p-1"><ChevronLeft /></span>
			<h6 class="font-semibold dark:text-darkPrimaryText">All Settings</h6>
		</nuxt-link>
		<!-- Email newsletter -->
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText pb-2 text-base font-semibold">Email newsletter</h3>
		<p class="text-gray5 dark:text-gray3 text-sm">
			You are currently receiving email newsletters from the following authors:
		</p>
		<div v-if="!isLoading" class="flex flex-wrap mt-4">
			<ProfilePreviewCard
				v-for="profiles in 4"
				:key="profiles.id"
				:profile="author1"
				class="pb-4 mx-1 mb-2"
				@manageNewsletter="$emit(`manageNewsletter`, author1)"
			/>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import ProfilePreviewCard from '@/components/ProfilePreviewCard.vue'
import ChevronLeft from '@/components/icons/ChevronLeft.vue'
import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'

interface IData {
	author1: Profile | null
	isLoading: boolean
}
export default Vue.extend({
	components: { ProfilePreviewCard, ChevronLeft },
	layout: `settings`,
	data(): IData {
		return {
			author1: null,
			isLoading: true,
		}
	},
	created() {
		// Get author profile
		this.author1 = createDefaultProfile(`nairobi`)
		getProfile(`nairobi`).then((p) => {
			const { profile } = p
			if (profile) {
				this.author1 = profile
			}
			this.isLoading = false
		})
	},
})
</script>