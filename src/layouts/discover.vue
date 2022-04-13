<template>
	<main
		class="w-full flex flex-col items-center bg-img m-0 h-screen overflow-y-hidden p-0 bg-lightMainBG dark:bg-darkBG"
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
		<Header :avatar="avatar" class="lg:w-11/12 xl:w-10/12 max-w-1220 my-5 fixed top-0" />
		<div class="w-full lg:w-11/12 xl:w-10/12 max-w-1220 mt-20 relative">
			<div
				style="margin-top: 62px"
				class="w-full lg:w-760 absolute min-h-70 h-70 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder overflow-y-auto rounded-t-lg bg-gradient-to-r shadow-lg"
			></div>
		</div>

		<!-- Title and peered nodes -->
		<div
			v-if="this.$route.name === `discover`"
			class="modal-animation hidden lg:flex w-full lg:max-w-1220 items-center justify-between px-3 lg:px-0 mb-5"
			style="height: 62px"
		>
			<h1 class="text-primary dark:text-secondary text-3xl font-semibold xl:text-4xl">Browse Blogchain</h1>
			<Nodes />
		</div>

		<!-- Main content scroll -->
		<div ref="container" class="flex w-full overflow-y-auto overflow-x-hidden justify-center" style="margin-top: 6px">
			<!-- Content container -->
			<div class="flex w-full lg:w-11/12 xl:w-10/12 relative flex-row justify-between max-w-1220">
				<div class="w-full lg:w-11/12 xl:w-10/12 max-w-1220 relative h-full flex flex-row justify-between">
					<nuxt-child
						ref="child"
						class="w-full lg:w-760 lg:flex-shrink-0 p-6"
						:toggleFriend="toggleFriend"
						:following="following"
					/>
				</div>
			</div>
			<!-- Widgets -->
			<aside class="fixed w-full flex justify-center top-24">
				<div class="w-full hidden lg:flex flex-row-reverse justify-between lg:w-11/12 xl:w-10/12 max-w-1220 relative">
					<div
						style="left: 760px; right: 0px; top: 20px"
						class="shrink ml-5 absolute max-w-500 h-screen overflow-y-auto p-5 pb-24"
					>
						<TagsWidget
							class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder mb-5 overflow-hidden rounded-lg border bg-gradient-to-r shadow-lg"
							style="backdrop-filter: blur(10px)"
						/>
						<Footer />
					</div>
				</div>
			</aside>
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
	lastScroll: number
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
			lastScroll: 0,
		}
	},
	watch: {
		$route() {
			const container = this.$refs.container as HTMLElement
			container.scrollTo({ top: 0, behavior: `smooth` })
		},
	},
	async created() {
		// Set color mode
		this.$setColorMode(this.$store.state.settings.mode)
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
	mounted() {
		const container = this.$refs.container as HTMLElement
		container.addEventListener(`scroll`, this.handleScroll, true)
	},
	methods: {
		handleScroll() {
			if (this.$route.name === `discover`) {
				return
			}
			const container = this.$refs.container as HTMLElement
			const childPage = this.$refs.child as HTMLElement
			// scrolling down
			if (container.scrollTop > this.lastScroll) {
				// @ts-ignore
				childPage.handleHeader(false)
			}
			// reached bottom
			if (container.scrollTop + container.clientHeight === container.scrollHeight) {
				// @ts-ignore
				childPage.fetchPosts()
			}
			// scrolling up
			if (container.scrollTop < this.lastScroll) {
				// @ts-ignore
				childPage.handleHeader(true)
			}
			// reached top
			if (container.scrollTop === 0) {
				// @ts-ignore
				childPage.handleHeader(true)
			}
			this.lastScroll = container.scrollTop
		},
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
