<template>
	<section class="w-full">
		<div>
			<!-- top -->
			<article
				id="header"
				ref="topContainer"
				class="min-h-fit header-profile z-20 w-full px-4 pt-3 xl:px-6 xl:pt-4"
				style="backdrop-filter: blur(10px)"
			>
				<!-- Back button -->
				<div class="flex flex-row items-center pb-4">
					<button
						v-if="$route.params.id !== $store.state.session.id"
						class="focus:outline-none flex flex-row items-center"
						@click="$router.go(-1)"
					>
						<span class="bg-gray1 rounded-full p-1"><BackButton :reduceSize="true" /></span>
						<h6 class="ml-2 font-sans font-semibold">Back</h6>
					</button>
					<div
						id="small"
						class="header-profile flex w-full flex-row items-center justify-between opacity0"
						:class="$route.params.id === $store.state.session.id ? `` : `ml-6`"
					>
						<div class="flex flex-row items-center">
							<Avatar
								:avatar="visitAvatar"
								:authorID="$route.params.id"
								:size="`w-8 h-8`"
								:noClick="true"
								class="rounded-base flex-shrink-0"
							/>
							<h6 v-if="visitProfile.name != ``" class="ml-2 font-sans font-semibold">{{ visitProfile.name }}</h6>
							<h6 v-else class="text-gray5 ml-2 font-sans font-semibold">{{ visitProfile.id }}</h6>
						</div>
						<div class="flex items-center">
							<SecondaryButton
								v-if="$store.state.session.id === $route.params.id"
								:text="`Edit Profile`"
								:action="toggleSettings"
							/>
							<FriendButton
								v-else
								:toggleFriend="toggleFriend"
								:userIsFollowed="userIsFollowed"
								class="header-profile"
							/>
						</div>
					</div>
				</div>
				<!-- Name, socials, follow, bio -->
				<div class="flex flex-row justify-between">
					<div
						id="infos"
						class="header-profile flex items-center"
						:class="$route.params.id === $store.state.session.id ? `-mt-12` : ``"
					>
						<Avatar
							:avatar="visitAvatar"
							:authorID="$route.params.id"
							:size="`w-20 h-20`"
							:noClick="true"
							class="flex-shrink-0 rounded-lg"
						/>
						<div class="ml-5 flex flex-grow flex-col">
							<!-- Name Username, Follow button -->
							<div class="flex flex-col">
								<h3 v-if="visitProfile.name != ``" class="pr-4 text-2xl font-semibold">
									{{ visitProfile.name }}
								</h3>
								<h3 v-else class="text-gray5 pr-4 text-2xl font-semibold">{{ visitProfile.id }}</h3>
								<h5 class="text-primary text-lg">@{{ visitProfile.id }}</h5>
							</div>
							<!-- Tabs: posts, following, followers -->
							<div class="text-gray6 -mr-12 flex flex-row pt-2 text-sm">
								<div v-if="totalPostsCount === 1" class="text-sm">
									<span class="text-primary font-bold">{{ totalPostsCount }}</span>
									Post
								</div>
								<div v-else class="text-sm">
									<span class="text-primary font-bold">{{ totalPostsCount }}</span>
									Posts
								</div>
								<nuxt-link
									:to="'/id/' + $route.params.id + '/followers'"
									:class="getStyles(`id-id-followers`)"
									class="pl-5 text-sm"
								>
									<span class="text-primary font-bold">{{ followers.size }}</span>
									Followers
								</nuxt-link>
								<nuxt-link
									:to="'/id/' + $route.params.id + '/following'"
									:class="getStyles(`id-id-following`)"
									class="pl-5 text-sm"
								>
									<span class="text-primary font-bold">{{ following.size }}</span>
									Following
								</nuxt-link>
							</div>
						</div>
					</div>
					<!-- Profile buttons -->
					<div
						id="buttons"
						class="header-profile h-fit flex items-center xl:h-auto"
						:class="$route.params.id === $store.state.session.id ? `-mt-12` : ``"
					>
						<!-- Edit profile button -->
						<span v-if="$store.state.session.id === $route.params.id">
							<button class="bg-secondary focus:outline-none block rounded-lg xl:hidden" @click="toggleSettings">
								<PencilIcon class="m-2 h-5 w-5 text-white" />
							</button>
							<SecondaryButton :text="`Edit Profile`" :action="toggleSettings" class="hidden xl:block" />
						</span>
						<FriendButton
							v-else
							:toggleFriend="toggleFriend"
							:userIsFollowed="userIsFollowed"
							class="header-profile flex-shrink-0"
						/>
					</div>
				</div>
				<!-- Bio -->
				<div v-if="visitProfile.bio" id="bio" class="header-profile px-1 pt-4">
					<p>
						{{ visitProfile.bio }}
					</p>
				</div>
				<div v-else id="bio" class="header-profile"></div>
				<!-- Tabs -->
				<div id="tabs" class="text-gray5 header-profile flex w-full justify-between pt-6 xl:px-6">
					<nuxt-link :to="'/id/' + $route.params.id" class="pb-1" :class="getStyles('id-id')">
						<span class="px-4">Posts</span>
					</nuxt-link>
					<nuxt-link :to="'/id/' + $route.params.id + '/comments'" class="pb-1" :class="getStyles('id-id-comments')">
						<span class="px-4">Comments</span>
					</nuxt-link>
					<nuxt-link :to="'/id/' + $route.params.id + '/reposts'" class="pb-1" :class="getStyles('id-id-reposts')">
						<span class="px-4">Reposts</span>
					</nuxt-link>
				</div>
			</article>
			<div
				v-if="loadedContent()"
				id="scrollContainer"
				ref="scrollContainer"
				class="xl:w-748 fixed w-full overflow-y-auto"
				:style="`min-height: calc(100vh - ` + padding + ` - 90px); height: calc(100vh - ` + padding + ` - 90px)`"
			>
				<nuxt-child
					:profile="visitProfile"
					:updateFollowers="updateFollowers"
					:followers="followers"
					:mutuals="mutuals"
					:mutualProfiles="mutualProfiles"
					:toggleFriend="toggleFriend"
					:userIsFollowed="userIsFollowed"
				/>
			</div>
		</div>
		<!-- Settings popup -->
		<div
			v-if="showSettings"
			class="bg-primary modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50"
		>
			<SettingsPopup
				class="xl:w-589 from-lightBGStart to-lightBGStop card-animation w-full rounded-lg bg-gradient-to-r shadow-lg backdrop-blur-lg backdrop-filter"
				style="backdrop-filter: blur(10px)"
				:updateProfileMethod="updateProfileMethod"
				@close="toggleSettings"
			/>
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import Avatar from '@/components/Avatar.vue'
import FriendButton from '@/components/FriendButton.vue'
import SecondaryButton from '@/components/SecondaryButton.vue'
import SettingsPopup from '@/components/Settings.vue'
import BackButton from '@/components/icons/ChevronLeft.vue'
import PencilIcon from '@/components/icons/Pencil.vue'
import { getProfile, Profile } from '@/backend/profile'
// @ts-ignore
import ogImage from '@/assets/images/util/ogImage.png'

interface IData {
	totalPostsCount: number
	padding: string
	showSettings: boolean
	lastScroll: number
	scrollingDown: boolean
}

export default Vue.extend({
	name: `RootIDPage`,
	components: {
		Avatar,
		FriendButton,
		SecondaryButton,
		SettingsPopup,
		BackButton,
		PencilIcon,
	},
	layout: `profile`,
	props: {
		visitProfile: {
			type: Object as PropType<Profile>,
			default: null,
		},
		visitAvatar: {
			type: String as PropType<ArrayBuffer | string | null>,
			default: null,
		},
		followers: {
			type: Set,
			required: true,
		},
		following: {
			type: Set,
			required: true,
		},
		toggleFriend: {
			type: Function as PropType<() => void>,
			required: true,
		},
		updateFollowers: {
			type: Function as PropType<() => void>,
			required: true,
		},
		userIsFollowed: {
			type: Boolean,
			required: true,
		},
		mutuals: {
			type: Set,
			default: new Set(),
		},
		mutualProfiles: {
			type: Array,
			default: () => {
				return []
			},
		},
		toggleEdit: {
			type: Boolean,
			required: false,
		},
		updateProfileMethod: {
			type: Function as PropType<() => void>,
			required: true,
		},
	},
	data(): IData {
		return {
			totalPostsCount: 0,
			padding: `0px`,
			showSettings: false,
			lastScroll: 0,
			scrollingDown: false,
		}
	},
	head() {
		return {
			title: `${this.visitProfile.name} (${this.$route.params.id}) on Capsule Social`,
			meta: [
				{
					hid: `profile`,
					name: `profile`,
					content: `${this.visitProfile.name} (${this.$route.params.id}) on Capsule Social`,
				},
				{ hid: `og:image`, property: `og:image`, content: `${document.location.origin}` + ogImage },
			],
		}
	},
	watch: {
		$route(n, o) {
			if (n.params.id !== o.params.id) {
				// Updates post count
				window.addEventListener(`click`, this.handleClose, false)
				this.fetchProfile()
			}
		},
	},
	created() {
		window.addEventListener(`click`, this.handleClose, false)
		this.fetchProfile()
	},
	mounted() {
		const topContainer = this.$refs.topContainer as HTMLElement
		this.padding = topContainer.clientHeight + `px`
		const container = document.getElementById(`scrollContainer`)
		if (container) {
			container.addEventListener(`scroll`, this.handleScrollHeader)
		}
		if (this.$store.state.settings.recentlyInSettings) {
			this.showSettings = true
		}
	},
	destroyed() {
		window.removeEventListener(`click`, this.handleClose)
		const container = document.getElementById(`scrollContainer`)
		if (container) {
			container.removeEventListener(`scroll`, this.handleScrollHeader)
		}
		if (this.$store.state.settings.recentlyInSettings) {
			this.$store.commit(`settings/setRecentlyInSettings`, false)
		}
	},
	methods: {
		handleClose(e: any): void {
			if (!e.target || e.target.firstChild === null || e.target.firstChild.classList === undefined) {
				return
			}
			if (e.target.firstChild.classList[0] === `popup`) {
				this.showSettings = false
			}
		},
		toggleSettings(): void {
			this.showSettings = !this.showSettings
		},
		loadedContent(): boolean {
			// Check follow page
			return !(this.$route.name === `id-followers` && this.followers.size === 0)
		},
		getStyles(tab: string): string {
			let res = ``
			if (this.$route.name === tab) {
				res += ` text-primary font-bold`
				if (this.$route.name !== `id-id-followers` && this.$route.name !== `id-id-following`) {
					res += ` border-b`
				}
			} else {
				if (this.$route.name !== `id-followers` && this.$route.name !== `id-following`) {
					res += ` text-grey1`
				}
				res += ` text-gray5`
			}
			return res
		},
		openWindow(url: string) {
			if (process.client) {
				window.open(url, `_blank`)
			}
		},
		handleScrollHeader() {
			const body = document.getElementById(`scrollContainer`)
			const header = document.getElementById(`header`)
			const buttons = document.getElementById(`buttons`)
			const infos = document.getElementById(`infos`)
			const tabs = document.getElementById(`tabs`)
			const bio = document.getElementById(`bio`)
			const small = document.getElementById(`small`)
			this.padding = header?.clientHeight + `px`
			const scrollUp = `headernotcollapsed`
			const scrollDown = `headercollapsed`
			const opacity1 = `opacity1`
			const opacity0 = `opacity0`
			if (!body) {
				console.log(`noBody`)
				return
			}
			if (!buttons) {
				console.log(`noButtons`)
				return
			}
			if (!infos) {
				console.log(`noInfos`)
				return
			}
			if (!header) {
				console.log(`noHeader`)
				return
			}
			if (!tabs) {
				console.log(`noTabs`)
				return
			}
			if (!bio) {
				console.log(`noBio`)
				return
			}
			if (!small) {
				console.log(`noSmall`)
				return
			}
			const currentScroll = body.scrollTop
			if (body.scrollTop <= 0) {
				console.log(`top`)
				header.classList.remove(scrollUp)
				buttons.classList.remove(opacity0)
				infos.classList.remove(opacity0)
				tabs.classList.remove(opacity0)
				bio.classList.remove(opacity0)
				small.classList.remove(opacity1)
				return
			}
			if (currentScroll > this.lastScroll && !header.classList.contains(scrollDown)) {
				// down
				console.log(`down`)
				this.scrollingDown = true
				header.classList.remove(scrollUp)
				header.classList.add(scrollDown)
				buttons.classList.remove(opacity1)
				buttons.classList.add(opacity0)
				infos.classList.remove(opacity1)
				infos.classList.add(opacity0)
				tabs.classList.add(opacity0)
				tabs.classList.remove(opacity1)
				bio.classList.add(opacity0)
				bio.classList.remove(opacity1)
				small.classList.add(opacity1)
				small.classList.remove(opacity0)
			} else if (
				currentScroll < this.lastScroll &&
				header.classList.contains(scrollDown) &&
				body.scrollTop + body.clientHeight !== body.scrollHeight
			) {
				// up
				console.log(`up`)
				this.scrollingDown = false
				header.classList.remove(scrollDown)
				header.classList.add(scrollUp)
				buttons.classList.remove(opacity0)
				buttons.classList.add(opacity1)
				infos.classList.remove(opacity0)
				infos.classList.add(opacity1)
				tabs.classList.remove(opacity0)
				tabs.classList.add(opacity1)
				bio.classList.remove(opacity0)
				bio.classList.add(opacity1)
				small.classList.remove(opacity1)
				small.classList.add(opacity0)
			}
			this.lastScroll = currentScroll
			// Reached bottom, fetch more posts
			if (body.scrollTop + body.clientHeight === body.scrollHeight) {
				console.log(`bottom`)
				// header.classList.add(scrollDown)
				// small.classList.remove(opacity0)
				// small.classList.add(opacity1)
			}
		},
		async fetchProfile() {
			if (this.$route.params.id === null) {
				return
			}
			const { totalPostsCount } = await getProfile(this.$route.params.id, true)
			this.totalPostsCount = totalPostsCount
		},
	},
})
</script>

<style>
.header-profile {
	transition: all 0.4s;
	/* z-index: 50; */
}
.headercollapsed {
	min-height: 1rem !important;
	height: 4rem !important;
}
.headernotcollapsed {
	opacity: 1;
}
.opacity0 {
	opacity: 0;
}
.opacity1 {
	opacity: 1;
}
</style>
