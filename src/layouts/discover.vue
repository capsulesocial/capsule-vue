<template>
	<main
		class="bg-img m-0 h-screen overflow-y-hidden p-0 bg-lightMainBG dark:bg-darkBG"
		:style="
			dark
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
			<div class="flex flex-col" style="width: 1220px">
				<!-- Header -->
				<Header :avatar="avatar" />
				<!-- Body -->
				<div>
					<!-- Title and peered nodes -->
					<div
						class="modal-animation fixed hidden xl:flex w-full items-center justify-between px-3 xl:px-0"
						style="width: 1220px; height: 62px"
					>
						<!-- Title -->
						<h1
							v-if="$route.name === `discover`"
							class="text-primary dark:text-secondary text-3xl font-semibold xl:text-4xl"
						>
							Browse Blogchain
						</h1>
						<!-- Peered nodes -->
						<Nodes />
					</div>
					<!-- Content -->
					<section class="modal-animation flex flex-row xl:mt-20">
						<nuxt-child
							:class="$route.name === `discover` ? `` : `xl:-mt-20`"
							class="xl:w-750 min-h-61 h-61 xl:min-h-80 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop fixed z-10 mr-5 box-content w-full overflow-y-auto rounded-lg bg-gradient-to-r shadow-lg xl:h-80"
							:toggleFriend="toggleFriend"
							:following="following"
						/>
						<!-- Widgets -->
						<aside
							:class="$route.name === `discover` ? `` : `-mt-24`"
							class="fixed -mt-4 hidden overflow-y-auto p-4 xl:block"
							:style="
								$route.name === `discover`
									? `min-height: calc(100vh - 150px); height: calc(100vh - 80px)`
									: `min-height: calc(100vh - 150px); height: calc(100vh - 80px)`
							"
							style="margin-left: 755px; width: 485px"
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
		</div>
		<UnauthPopup />
		<portal-target name="card-popup"></portal-target>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import UnauthPopup from '@/components/popups/UnauthPopup.vue'
import TagsWidget from '@/components/widgets/Tags.vue'
import Nodes from '@/components/Nodes.vue'

import { IBackground, backgrounds } from '@/config'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'
import { followChange, getFollowersAndFollowing } from '@/backend/following'

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
	following: Set<string>
	bgImage: IBackground
	dark: boolean
}

export default Vue.extend({
	components: {
		TagsWidget,
		Header,
		Footer,
		Nodes,
		UnauthPopup,
	},
	data(): IData {
		return {
			profile: null,
			avatar: null,
			following: new Set(),
			bgImage: backgrounds[0],
			dark: false,
		}
	},
	async created() {
		// Set color mode
		this.$setColorMode(this.$store.state.settings.darkMode)
		if (document.documentElement.classList.contains(`dark`)) {
			this.dark = true
		} else {
			this.dark = false
		}
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
				if (axios.isAxiosError(err)) {
					if (!err.response) {
						this.$toastError(`Network error, please try again`)
						return
					}
					if (err.response.status === 429) {
						this.$toastError(`Too many requests, please try again`)
						return
					}
					this.$toastError(err.response.data.error)
					return
				}
				if (err instanceof Error) {
					this.$toastError(err.message)
					return
				}
				throw err
			}
		},
	},
})
</script>
