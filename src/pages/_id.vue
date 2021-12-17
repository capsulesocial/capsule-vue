<template>
	<section class="w-full">
		<div>
			<!-- top -->
			<article
				id="header"
				ref="topContainer"
				class="px-6 pt-6 z-20 w-full header-profile"
				:style="scrollingDown ? `height: 4.5rem !important;` : ``"
				style="backdrop-filter: blur(10px)"
			>
				<!-- Back button -->
				<div v-if="$route.params.id !== $store.state.session.id" class="pb-4">
					<button class="flex flex-row items-center -mt-1 focus:outline-none" @click="$router.go(-1)">
						<span class="bg-gray1 rounded-full p-1"><BackButton :reduceSize="true" /></span>
						<h6 id="button" class="font-semibold ml-2 font-sans header-profile">Back</h6>
					</button>
				</div>
				<!-- Name, socials, follow, bio -->
				<div class="flex flex-row justify-between">
					<div class="flex items-center">
						<Avatar
							id="avatar"
							:avatar="visitAvatar"
							:authorID="$route.params.id"
							:size="scrollingDown ? `w-12 h-12` : `w-24 h-24`"
							class="header-profile rounded-lg"
						/>
						<div class="flex flex-col flex-grow ml-5">
							<!-- Name Username, Follow button -->
							<div class="flex flex-col">
								<h3 id="title" class="text-2xl pr-4 font-semibold header-profile">
									{{ visitProfile.name }}
								</h3>
								<h5 id="id" class="text-primary text-lg header-profile">@{{ visitProfile.id }}</h5>
							</div>
							<!-- Tabs: posts, following, followers -->
							<div id="stats" class="flex flex-row pt-2 text-sm text-gray6 header-profile">
								<nuxt-link :to="'/' + $route.params.id" class="text-sm" :class="getStyles(`id-categories`)">
									<span class="font-bold text-primary">{{ posts.length }}</span>
									Posts
								</nuxt-link>
								<nuxt-link
									:to="'/' + $route.params.id + '/followers'"
									:class="getStyles(`id-followers`)"
									class="pl-5 text-sm"
								>
									<span class="font-bold text-primary">{{ followers.size }}</span>
									Followers
								</nuxt-link>
								<nuxt-link
									:to="'/' + $route.params.id + '/following'"
									:class="getStyles(`id-following`)"
									class="pl-5 text-sm"
								>
									<span class="font-bold text-primary">{{ following.size }}</span>
									Following
								</nuxt-link>
							</div>
						</div>
					</div>
					<!-- Profile buttons -->
					<div class="flex items-center">
						<SecondaryButton
							v-if="$store.state.session.id === $route.params.id"
							:text="`Edit Profile`"
							:action="toggleSettings"
						/>
						<FriendButton
							v-else
							id="follow"
							:toggleFriend="toggleFriend"
							:userIsFollowed="userIsFollowed"
							class="header-profile"
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
				<div id="tabs" class="flex flex-col md:flex-row w-full justify-between text-gray5 pt-6 header-profile px-6">
					<nuxt-link :to="'/' + $route.params.id" class="pb-1" :class="getStyles('id')">
						<span class="px-4">Posts</span>
					</nuxt-link>
					<nuxt-link :to="'/' + $route.params.id + '/comments'" class="pb-1" :class="getStyles('id-comments')">
						<span class="px-4">Comments</span>
					</nuxt-link>
					<nuxt-link :to="'/' + $route.params.id + '/reposts'" class="pb-1" :class="getStyles('id-reposts')">
						<span class="px-4">Reposts</span>
					</nuxt-link>
				</div>
			</article>
			<div
				v-if="loadedContent()"
				id="scrollContainer"
				ref="scrollContainer"
				class="fixed overflow-y-auto"
				style="width: 748px"
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
			class="fixed w-full h-screen bg-primary top-0 bottom-0 left-0 right-0 z-30 flex justify-center items-center bg-opacity-50"
		>
			<SettingsPopup
				class="bg-gradient-to-r from-lightBGStart to-lightBGStop backdrop-filter backdrop-blur-lg shadow-lg rounded-lg"
				style="width: 589px; backdrop-filter: blur(10px)"
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
import { Post } from '@/backend/post'
import { Profile } from '@/backend/profile'

interface IData {
	posts: Post[]
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
	},
	data(): IData {
		return {
			posts: [],
			padding: `0px`,
			showSettings: false,
			lastScroll: 0,
			scrollingDown: false,
		}
	},
	created() {
		window.addEventListener(`click`, this.handleClose, false)
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
		loadedContent(): Boolean {
			// Check follow page
			if (this.$route.name === `id-followers` && this.followers.size === 0) {
				return false
			}
			return true
		},
		getStyles(tab: string): string {
			let res = ``
			if (this.$store.state.settings.darkMode) {
				res += `border-lightActive`
			} else {
				res += `border-darkActive`
			}
			if (this.$route.name === tab) {
				res += ` text-primary font-bold`
				if (
					this.$route.name !== `id-followers` &&
					this.$route.name !== `id-following` &&
					this.$route.name !== `id-categories`
				) {
					res += ` border-b`
				}
			} else {
				if (
					this.$route.name !== `id-followers` &&
					this.$route.name !== `id-following` &&
					this.$route.name !== `id-categories`
				) {
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
			const button = document.getElementById(`button`)
			const avatar = document.getElementById(`avatar`)
			const title = document.getElementById(`title`)
			const follow = document.getElementById(`follow`)
			const tabs = document.getElementById(`tabs`)
			const id = document.getElementById(`id`)
			const stats = document.getElementById(`stats`)
			const bio = document.getElementById(`bio`)
			this.padding = header?.clientHeight + `px`
			const scrollUp = `scrollupprofile`
			const scrollDown = `scrolldownprofile`
			const buttoncollapsed = `buttoncollapsed`
			const buttonnotcollapsed = `buttonnotcollapsed`
			const avatarcollapsed = `avatarcollapsed`
			const avatarnotcollapsed = `avatarnotcollapsed`
			const titlecollapsed = `titlecollapsed`
			const titlenotcollapsed = `titlenotcollapsed`
			const followcollapsed = `followcollapsed`
			const follownotcollapsed = `follownotcollapsed`
			const tabscollapsed = `tabscollapsed`
			const tabsnotcollapsed = `tabsnotcollapsed`
			if (!body) {
				return
			}
			if (!button) {
				return
			}
			if (!follow) {
				return
			}
			if (!avatar) {
				return
			}
			if (!title) {
				return
			}
			if (!header) {
				return
			}
			if (!id) {
				return
			}
			if (!stats) {
				return
			}
			if (!tabs) {
				return
			}
			if (!bio) {
				return
			}
			const currentScroll = body.scrollTop
			if (body.scrollTop <= 0) {
				header.classList.remove(scrollUp)
				button.classList.remove(buttoncollapsed)
				avatar.classList.remove(avatarcollapsed)
				title.classList.remove(titlecollapsed)
				follow.classList.remove(followcollapsed)
				tabs.classList.remove(tabscollapsed)
				id.classList.remove(buttoncollapsed)
				stats.classList.remove(buttoncollapsed)
				bio.classList.remove(buttoncollapsed)
				return
			}
			if (currentScroll > this.lastScroll && !header.classList.contains(scrollDown)) {
				// down
				this.scrollingDown = true
				header.classList.remove(scrollUp)
				header.classList.add(scrollDown)
				button.classList.remove(buttonnotcollapsed)
				button.classList.add(buttoncollapsed)
				avatar.classList.remove(avatarnotcollapsed)
				avatar.classList.add(avatarcollapsed)
				title.classList.add(titlecollapsed)
				title.classList.remove(titlenotcollapsed)
				follow.classList.add(followcollapsed)
				follow.classList.remove(follownotcollapsed)
				tabs.classList.add(tabscollapsed)
				tabs.classList.remove(tabsnotcollapsed)
				id.classList.add(buttoncollapsed)
				id.classList.remove(buttonnotcollapsed)
				stats.classList.add(buttoncollapsed)
				stats.classList.remove(buttonnotcollapsed)
				bio.classList.add(buttoncollapsed)
				bio.classList.remove(buttonnotcollapsed)
			} else if (currentScroll < this.lastScroll && header.classList.contains(scrollDown)) {
				// up
				this.scrollingDown = false
				header.classList.remove(scrollDown)
				header.classList.add(scrollUp)
				button.classList.remove(buttoncollapsed)
				button.classList.add(buttonnotcollapsed)
				avatar.classList.remove(avatarcollapsed)
				avatar.classList.add(avatarnotcollapsed)
				title.classList.remove(titlecollapsed)
				title.classList.add(titlenotcollapsed)
				follow.classList.remove(followcollapsed)
				follow.classList.add(follownotcollapsed)
				tabs.classList.remove(tabscollapsed)
				tabs.classList.add(tabsnotcollapsed)
				id.classList.remove(buttoncollapsed)
				id.classList.add(buttonnotcollapsed)
				stats.classList.remove(buttoncollapsed)
				stats.classList.add(buttonnotcollapsed)
				bio.classList.remove(buttoncollapsed)
				bio.classList.add(buttonnotcollapsed)
			}
			this.lastScroll = currentScroll
		},
	},
})
</script>

<style>
.header-profile {
	transition: all 0.4s;
	z-index: 50;
}
.buttoncollapsed {
	opacity: 0;
}
.buttonnotcollapsed {
	opacity: 1;
}
.avatarcollapsed {
	height: 3rem;
	width: 3rem;
	transform: translate3d(45px, -75px, 0px);
}
.avatarnotcollapsed {
	height: 6rem;
	width: 6rem;
	transform: translate3d(0, 0, 0);
}
.titlecollapsed {
	transform: translate3d(40px, -47px, 0px);
}
.titlenotcollapsed {
	transform: translate3d(0, 0, 0);
}
.followcollapsed {
	transform: translate3d(0px, -75px, 0px);
}
.follownotcollapsed {
	transform: translate3d(0, 0, 0);
}
.tabscollapsed {
	transform: translate3d(0px, -165px, 0px);
}
.tabsnotcollapsed {
	transform: translate3d(0, 0, 0);
}
</style>
