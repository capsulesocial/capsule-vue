<template>
	<div
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
	>
		<!-- Container -->
		<section class="popup">
			<div
				v-if="profile !== null"
				class="min-h-40 w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg px-6 pt-4 pb-2 shadow-lg"
			>
				<div class="sticky flex items-center justify-between mb-6">
					<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-3xl font-semibold">Reposted this post</h2>
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="$emit(`close`)">
						<CloseIcon />
					</button>
				</div>
				<div v-show="isLoading" class="modal-animation flex w-full justify-center z-20 mt-24">
					<div
						class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
						:style="`border-top: 2px solid` + $color.hex"
					></div>
				</div>
				<article v-show="!isLoading">
					<div v-for="p in profiles" :key="p.id">
						<ProfilePreview :profile="p" class="pb-4" @updateFollowers="updateFollowers" />
					</div>
				</article>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import ProfilePreview from '@/components/ProfilePreview.vue'
import CloseIcon from '@/components/icons/X.vue'
import { getReposters, IGetRepostsOptions } from '@/backend/reposts'

import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'

interface IData {
	isLoading: boolean
	profiles: Array<Profile>
	reposters: Array<string>
	followers: Set<string>
}

export default Vue.extend({
	components: { ProfilePreview, CloseIcon },
	props: {
		postCID: {
			type: String,
			required: true,
		},
	},
	data(): IData {
		return {
			isLoading: true,
			profiles: [],
			reposters: [],
			followers: new Set(),
		}
	},
	mounted() {
		this.initReposters()
		window.addEventListener(`click`, this.handleCloseClick, false)
	},
	methods: {
		updateFollowers(): void {
			this.$emit(`updateFollowers`)
		},
		handleCloseClick(e: any): void {
			if (!e.target || e.target.parentNode === null || e.target.parentNode.classList === undefined) {
				return
			}
			if (e.target.firstChild.classList[0] === `popup`) {
				this.closeDraftsPopup()
			}
		},
		closeDraftsPopup(): void {
			this.$emit(`close`)
		},
		async getFollowers(p: string) {
			let profile = createDefaultProfile(p)
			const fetchedProfile = await getProfile(p)
			if (fetchedProfile.profile) {
				profile = fetchedProfile.profile
			}
			this.profiles.push(profile)
		},
		async initReposters() {
			const options: IGetRepostsOptions = { sort: `NEW`, offset: 0, limit: 1000 }
			this.reposters = await getReposters(this.postCID, options)
			this.reposters.forEach(this.getFollowers)
			this.isLoading = false
		},
	},
})
</script>
