<template>
	<section class="w-full">
		<div>
			<!-- top -->
			<article
				id="header"
				ref="topContainer"
				class="px-6 pt-4 z-20 w-full min-h-fit header-profile"
				style="backdrop-filter: blur(10px)"
			>
				<!-- Back button -->
				<div v-if="$route.params.id !== $store.state.session.id" class="pb-4 flex flex-row items-center">
					<button class="flex flex-row items-center focus:outline-none" @click="$router.go(-1)">
						<span class="bg-gray1 rounded-full p-1"><BackButton :reduceSize="true" /></span>
						<h6 class="font-semibold ml-2 font-sans">Back</h6>
					</button>
					<div id="small" class="flex flex-row justify-between items-center w-full header-profile ml-6 opacity-0">
						<div class="flex flex-row items-center">
							<Avatar
								:avatar="visitAvatar"
								:authorID="$route.params.id"
								:size="`w-8 h-8`"
								class="rounded-base flex-shrink-0"
							/>
							<h6 class="font-semibold ml-2 font-sans">{{ visitProfile.name }}</h6>
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
					<div id="infos" class="flex items-center header-profile">
						<Avatar
							:avatar="visitAvatar"
							:authorID="$route.params.id"
							:size="`w-24 h-24`"
							class="rounded-lg flex-shrink-0"
						/>
						<div class="flex flex-col flex-grow ml-5">
							<!-- Name Username, Follow button -->
							<div class="flex flex-col">
								<h3 class="text-2xl pr-4 font-semibold">
									{{ visitProfile.name }}
								</h3>
								<h5 class="text-primary text-lg">@{{ visitProfile.id }}</h5>
							</div>
							<!-- Tabs: posts, following, followers -->
							<div class="flex flex-row pt-2 text-sm text-gray6 -mr-12">
								<div v-if="totalPostsCount === 1" class="text-sm">
									<span class="font-bold text-primary">{{ totalPostsCount }}</span>
									Post
								</div>
								<div v-else class="text-sm">
									<span class="font-bold text-primary">{{ totalPostsCount }}</span>
									Posts
								</div>
								<nuxt-link
									:to="'/id/' + $route.params.id + '/followers'"
									:class="getStyles(`id-id-followers`)"
									class="pl-5 text-sm"
								>
									<span class="font-bold text-primary">{{ followers.size }}</span>
									Followers
								</nuxt-link>
								<nuxt-link
									:to="'/id/' + $route.params.id + '/following'"
									:class="getStyles(`id-id-following`)"
									class="pl-5 text-sm"
								>
									<span class="font-bold text-primary">{{ following.size }}</span>
									Following
								</nuxt-link>
							</div>
						</div>
					</div>
					<!-- Profile buttons -->
					<div id="buttons" class="flex items-center header-profile h-fit xl:h-auto">
						<!-- Edit profile button -->
						<span v-if="$store.state.session.id === $route.params.id">
							<button class="block xl:hidden bg-primary rounded-lg focus:outline-none" @click="toggleSettings">
								<PencilIcon class="text-white m-2 w-5 h-5" />
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
				<div v-if="visitProfile.bio" id="bio" class="pt-4 px-1 header-profile">
					<p>
						{{ visitProfile.bio }}
					</p>
				</div>
				<!-- Tabs -->
				<div id="tabs" class="flex w-full justify-between text-gray5 pt-6 header-profile xl:px-6">
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
				class="fixed w-full xl:w-748 overflow-y-auto"
				:style="`min-height: calc(100vh - ` + padding + ` - 90px); height: calc(100vh - ` + padding + ` - 90px)`"
			>
				<nuxt-child
					:profile="visitProfile"
					:updateFollowers="updateFollowers"
					:followers="followers"
					:mutuals="mutuals"
					:mutualProfiles="mutualProfiles"
				/>
			</div>
		</div>
		<!-- Settings popup -->
		<div
			v-if="showSettings"
			class="fixed w-full h-screen bg-primary top-0 bottom-0 left-0 right-0 z-30 flex justify-center items-center bg-opacity-50 modal-animation"
		>
			<SettingsPopup
				class="w-full xl:w-589 bg-gradient-to-r from-lightBGStart to-lightBGStop backdrop-filter backdrop-blur-lg shadow-lg rounded-lg card-animation"
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
		updateProfileMethod: { type: Function as PropType<() => void>, required: true },
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
	},
	destroyed() {
		window.removeEventListener(`click`, this.handleClose)
		const container = document.getElementById(`scrollContainer`)
		if (container) {
			container.removeEventListener(`scroll`, this.handleScrollHeader)
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
				return
			}
			if (!buttons) {
				return
			}
			if (!infos) {
				return
			}
			if (!header) {
				return
			}
			if (!tabs) {
				return
			}
			if (!bio) {
				return
			}
			if (!small) {
				return
			}
			const currentScroll = body.scrollTop
			if (body.scrollTop <= 0) {
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
			} else if (currentScroll < this.lastScroll && header.classList.contains(scrollDown)) {
				// up
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
