<template>
	<main
		class="bg-img m-0 h-screen overflow-y-hidden p-0 bg-lightBG dark:bg-darkBG"
		:style="
			$colorMode.dark
				? {
						backgroundImage: `url(` + bgImage.dark + `)`,
				  }
				: {
						backgroundImage: `url(` + bgImage.light + `)`,
				  }
		"
	>
		<!-- Wrapper -->
		<div class="flex w-full justify-center">
			<div class="flex flex-col w-full lg:w-11/12 xl:w-10/12 max-w-1220">
				<!-- Header -->
				<Header :avatar="avatar" />
				<!-- Body -->
				<!-- Title and peered nodes -->
				<div
					v-if="$route.name === `discover`"
					class="modal-animation hidden lg:flex w-full items-center justify-between px-3 lg:px-0"
					style="height: 62px"
				>
					<!-- Title -->
					<h1 class="text-lightPrimaryText dark:text-darkPrimaryText text-3xl font-semibold xl:text-4xl">
						Browse Blogchain
					</h1>
					<!-- Peered nodes -->
					<Nodes />
				</div>
				<!-- Content -->
				<section class="modal-animation flex flex-row lg:mt-2 xl:mt-5">
					<nuxt-child
						:class="$route.name === `discover` ? `` : `lg:-mt-2 xl:-mt-4`"
						class="lg:w-7.5 min-h-61 h-61 xl:min-h-80 xl:h-80 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop z-10 box-content w-full overflow-y-hidden rounded-lg bg-gradient-to-r shadow-lg"
						:toggleFriend="toggleFriend"
						:following="following"
					/>
					<!-- Widgets -->
					<aside
						:class="$route.name === `discover` ? `` : `lg:-mt-6 xl:-mt-8`"
						class="w-5/12 -mr-5 -mt-4 hidden overflow-y-auto p-4 lg:block"
						:style="
							$route.name === `discover`
								? `min-height: calc(100vh - 150px); height: calc(100vh - 80px)`
								: `min-height: calc(100vh - 150px); height: calc(100vh - 80px)`
						"
					>
						<TagsWidget
							class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder mb-5 overflow-hidden rounded-lg border bg-gradient-to-r shadow-lg"
							style="backdrop-filter: blur(10px)"
						/>
						<Footer />
					</aside>
				</section>
			</div>
		</div>
		<UnauthPopup />
		<portal-target name="card-popup"></portal-target>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import UnauthPopup from '@/components/popups/UnauthPopup.vue'
import TagsWidget from '@/components/widgets/Tags.vue'
import Nodes from '@/components/Nodes.vue'

import { IBackground, backgrounds } from '@/config'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import { followChange, getFollowersAndFollowing } from '@/backend/following'

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
	following: Set<string>
	bgImage: IBackground
}

export default Vue.extend({
	components: {
		TagsWidget,
		Header,
		Footer,
		Nodes,
		UnauthPopup,
	},
	middleware: `auth`,
	data(): IData {
		return {
			profile: null,
			avatar: null,
			following: new Set(),
			bgImage: backgrounds[0],
		}
	},
	async created() {
		// Set color mode
		this.$setColorMode(this.$store.state.settings.darkMode)
		this.$setColor(this.$store.state.settings.color)
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			return
		}
		// get logged in profile
		const { profile } = await getProfile(this.$store.state.session.id)
		this.profile = profile
		this.bgImage = this.$getBGImage(this.profile?.background, `local`)
		// Get avatar
		if (this.profile && this.profile.avatar.length > 1) {
			getPhotoFromIPFS(this.profile.avatar).then((p) => {
				this.avatar = p
			})
		}
		// Get followers and following
		getFollowersAndFollowing(this.$store.state.session.id, true).then(({ following }) => {
			this.following = following
		})
	},
	methods: {
		async toggleFriend(authorID: string) {
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			try {
				if (authorID !== this.$store.state.session.id) {
					await followChange(
						this.following.has(authorID) ? `UNFOLLOW` : `FOLLOW`,
						this.$store.state.session.id,
						authorID,
					)
					this.$toastSuccess(this.following.has(authorID) ? `Unfollowed ${authorID}` : `Followed ${authorID}`)
					const data = await getFollowersAndFollowing(this.$store.state.session.id, true)
					this.following = data.following
				}
			} catch (err: unknown) {
				this.$handleError(err)
			}
		},
	},
})
</script>
