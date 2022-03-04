<template>
	<div class="popup">
		<!-- Container -->
		<section
			class="popup bg-primary dark:bg-secondary modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		>
			<div
				v-if="profile !== null"
				style="backdrop-filter: blur(10px)"
				class="min-h-40 w-full lg:w-600 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg bg-gradient-to-r px-6 pt-4 pb-2 shadow-lg"
			>
				<div class="sticky flex items-center justify-between mb-6">
					<h2
						v-if="$route.params.id === $store.state.session.id"
						class="text-primary dark:text-secondary text-3xl font-semibold"
					>
						You are following
					</h2>
					<h2 v-else-if="profile.name !== ``" class="text-primary dark:text-secondary text-3xl font-semibold">
						{{ profile.name }} is following
					</h2>
					<h2 v-else class="text-primary dark:text-secondary text-3xl font-semibold">{{ profile.id }} is following</h2>
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="$emit(`close`)">
						<CloseIcon />
					</button>
				</div>
				<article v-if="profiles.length == 0" class="mt-24 grid justify-items-center px-10 xl:px-0">
					<p class="text-gray5 dark:text-gray3 mb-5 text-center text-sm">
						<span v-if="$route.params.id === $store.state.session.id">
							It seems you're not following anyone yet!<br />
							you can start follow content creators all around Blogchain:
						</span>
						<span v-else-if="profile.name !== ``"> It seems that {{ profile.name }} is not following anyone yet!</span>
						<span v-else> It seems that {{ profile.id }} is not following anyone yet!</span>
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
import { getFollowersAndFollowing } from '@/backend/following'
import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'

interface IData {
	isLoading: boolean
	profiles: any
}

export default Vue.extend({
	components: { ProfilePreview, CloseIcon, SecondaryButton },
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
		window.addEventListener(`click`, this.handleCloseClick, false)
		const res = await getFollowersAndFollowing(this.$route.params.id)
		const following = res.following
		following.forEach(this.getFollowing)
	},
	destroyed() {
		window.removeEventListener(`click`, this.handleCloseClick)
	},
	methods: {
		handleCloseClick(e: any): void {
			if (!e.target || e.target.parentNode === null || e.target.parentNode.classList === undefined) {
				return
			}
			if (e.target.parentNode.classList[0] === `popup`) {
				this.closeDraftsPopup()
			}
		},
		closeDraftsPopup(): void {
			this.$emit(`close`)
		},
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
