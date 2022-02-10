<template>
	<main
		class="bg-img m-0 h-screen p-0"
		:style="{
			background:
				`linear-gradient(180deg, rgba(46, 85, 106, 0.02) 0%, rgba(46, 85, 106, 0) 50%), url(` +
				this.bgImage.image +
				`)`,
			backgroundSize: `contain`,
		}"
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
						class="modal-animation fixed flex w-full items-center justify-between px-3 xl:px-0"
						style="width: 1220px; height: 62px"
					>
						<!-- Title -->
						<h1 v-if="$route.name === `discover`" class="text-primary text-3xl font-semibold xl:text-4xl">
							Browse Capsule
						</h1>
						<!-- Peered nodes -->
						<Nodes />
					</div>
					<!-- Content -->
					<section class="modal-animation mt-16 flex flex-row xl:mt-20">
						<nuxt-child
							:class="$route.name === `discover` ? `` : `-mt-16 xl:-mt-20`"
							class="xl:w-750 min-h-61 h-61 xl:min-h-80 from-lightBGStart to-lightBGStop fixed z-10 mr-5 box-content w-full overflow-y-auto rounded-lg bg-gradient-to-r shadow-lg xl:h-80"
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
								class="from-lightBGStart to-lightBGStop border-lightBorder mb-5 overflow-hidden rounded-lg border bg-gradient-to-r shadow-lg"
								style="backdrop-filter: blur(10px)"
							/>
							<Footer />
						</aside>
					</section>
				</div>
			</div>
		</div>
		<UnauthPopup />
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import UnauthPopup from '@/components/UnauthPopup.vue'
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
		}
	},
	watch: {
		$route(n, o) {
			if (n.params.tag === undefined) {
				return
			}
			if (o.params.tag !== undefined) {
				location.reload()
			}
		},
	},
	async created() {
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
		getFollowersAndFollowing(this.$store.state.session.id).then(({ following }) => {
			this.following = following
		})
	},
	methods: {
		async toggleFriend(authorID: string) {
			if (authorID !== this.$store.state.session.id) {
				await followChange(this.following.has(authorID) ? `UNFOLLOW` : `FOLLOW`, this.$store.state.session.id, authorID)
				const data = await getFollowersAndFollowing(this.$store.state.session.id, true)
				this.following = data.following
			}
		},
	},
})
</script>
