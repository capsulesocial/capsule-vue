<template>
	<main>
		<!-- Mobile back button -->
		<nuxt-link to="/settings" class="mb-6 flex items-center lg:hidden">
			<span class="bg-gray1 dark:bg-gray5 mr-4 rounded-full p-1"><ChevronLeft /></span>
			<h6 class="font-semibold dark:text-darkPrimaryText">All Settings</h6>
		</nuxt-link>
		<!-- Email newsletter -->
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText pb-2 text-base font-semibold">Email notifications</h3>
		<p class="text-gray5 dark:text-gray3 text-sm">
			You are currently receiving email notifications from the following authors:
		</p>
		<div v-if="!isLoading && authorProfiles.length === 0" class="flex justify-center text-center px-20 mt-20">
			<p class="text-gray5 dark:text-gray3 text-sm">
				It seems you have not setup any email notifications to Blogchain's authors. You can create one directly on their
				profile
			</p>
		</div>
		<div v-if="!isLoading" class="flex flex-wrap mt-4">
			<ProfilePreviewCard
				v-for="profile in this.authorProfiles"
				:key="profile.id"
				:profile="profile"
				class="pb-4 mx-1 mb-2"
				@manageNewsletter="$emit(`manageNewsletter`, profile)"
			/>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import ProfilePreviewCard from '@/components/ProfilePreviewCard.vue'
import ChevronLeft from '@/components/icons/ChevronLeft.vue'
import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import { listAllAuthors } from '@/backend/emails'

interface IData {
	authorIDs: Array<string>
	authorProfiles: Array<Profile>
	isLoading: boolean
}
export default Vue.extend({
	components: { ProfilePreviewCard, ChevronLeft },
	layout: `settings`,
	data(): IData {
		return {
			authorIDs: [],
			authorProfiles: [],
			isLoading: true,
		}
	},
	async created() {
		// Get author profile
		try {
			this.authorIDs = await listAllAuthors(this.$store.state.session.id)
			for (const authorID of this.authorIDs) {
				getProfile(authorID).then((p) => {
					const { profile } = p
					this.authorProfiles.push(profile ?? createDefaultProfile(authorID))
				})
			}
		} catch (err) {
			this.$handleError(err)
		}
		this.isLoading = false
	},
})
</script>