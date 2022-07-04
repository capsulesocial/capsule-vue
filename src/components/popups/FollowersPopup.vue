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
					<h2
						v-if="$route.params.id === $store.state.session.id || $route.name === `home`"
						class="text-lightPrimaryText dark:text-darkPrimaryText text-3xl font-semibold"
					>
						Your followers
					</h2>
					<h2
						v-else-if="profile.name !== ``"
						class="text-lightPrimaryText dark:text-darkPrimaryText text-3xl font-semibold"
					>
						{{ profile.name }}'s followers
					</h2>
					<h2 v-else class="text-lightPrimaryText dark:text-darkPrimaryText text-3xl font-semibold">
						{{ profile.id }}'s followers
					</h2>
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="$emit(`close`)">
						<CloseIcon />
					</button>
				</div>
				<article v-if="profiles.length == 0" class="mt-24 grid justify-items-center px-10 xl:px-0">
					<p class="text-gray5 dark:text-gray3 mb-5 text-center text-sm">
						<span v-if="$route.params.id === $store.state.session.id || $route.name === `home`">
							It seems you don't have any followers yet!
						</span>
						<span v-else-if="profile.name !== ``">
							It looks like {{ profile.name }} doesn't have any followers yet!
						</span>
						<span v-else> It seems that {{ profile.id }} doesn't have any followers yet! </span>
					</p>
					<SecondaryButton
						v-if="$store.state.session.id === $route.params.id || $route.name === `home`"
						:text="`Discover new content`"
						:action="toggleDiscover"
					/>
				</article>
				<article>
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
import type { PropType } from 'vue'
import ProfilePreview from '@/components/ProfilePreview.vue'
import SecondaryButton from '@/components/SecondaryButton.vue'
import CloseIcon from '@/components/icons/X.vue'
import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'

interface IData {
	isLoading: boolean
	profiles: Profile[]
}

export default Vue.extend({
	components: { ProfilePreview, CloseIcon, SecondaryButton },
	props: {
		followers: {
			type: Set as PropType<Set<string>>,
			required: true,
		},
		profile: {
			type: Object as PropType<Profile | null>,
			default: null,
		},
	},
	data(): IData {
		return {
			isLoading: true,
			profiles: [],
		}
	},
	mounted() {
		this.followers.forEach(this.getFollowers)
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
			if (profile) {
				this.profiles.push(profile)
			}
		},
		toggleDiscover() {
			this.$router.push(`/discover`)
		},
	},
})
</script>
