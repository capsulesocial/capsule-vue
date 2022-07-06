<template>
	<div class="popup">
		<!-- Container -->
		<section
			class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		>
			<div
				v-if="profile !== null"
				class="min-h-40 w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation max-h-90 overflow-y-auto rounded-lg px-6 pt-4 pb-2 shadow-lg"
			>
				<div class="sticky flex items-center justify-between mb-6">
					<h2 v-if="profile.name !== ``" class="text-lightPrimaryText dark:text-darkPrimaryText text-3xl font-semibold">
						Mutual Followers with {{ profile.name }}
					</h2>
					<h2 v-else class="text-lightPrimaryText dark:text-darkPrimaryText text-3xl font-semibold">
						Mutual Followers with {{ profile.id }}
					</h2>
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="$emit(`close`)">
						<CloseIcon />
					</button>
				</div>
				<article v-if="mutualProfiles.length == 0" class="mt-24 grid justify-items-center px-10 xl:px-0">
					<p class="text-gray5 dark:text-gray3 mb-5 text-center text-sm">
						<span v-if="profile.name !== ``">
							It seems you don't have any mutual followers with {{ profile.name }}
						</span>
						<span v-else> It seems you don't have any mutual followers with {{ profile.id }} </span>
					</p>
					<SecondaryButton :text="`Follow more people`" :action="toggleDiscover" />
				</article>
				<article>
					<div v-for="p in mutualProfiles" :key="p.id">
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
import { Profile } from '@/backend/profile'

interface IData {
	isLoading: boolean
}

export default Vue.extend({
	components: { ProfilePreview, CloseIcon, SecondaryButton },
	props: {
		profile: {
			type: Object as PropType<Profile | null>,
			default: null,
		},
		mutualProfiles: {
			type: Array,
			required: true,
		},
		updateFollowers: {
			type: Function as PropType<() => void>,
			required: true,
		},
	},
	data(): IData {
		return {
			isLoading: true,
		}
	},
	created() {
		window.addEventListener(`click`, this.handleCloseClick, false)
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
		toggleDiscover() {
			this.$router.push(`/home`)
		},
	},
})
</script>
