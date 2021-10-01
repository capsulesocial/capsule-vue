<template>
	<section class="w-full border-l border-r" style="min-height: calc(100vh - 95px)">
		<!-- IF a profile exists -->
		<div v-if="currentUser" style="width: 660px">
			<!-- Fixed top -->
			<article class="fixed bg-white z-20 border-r" style="width: 659px">
				<!-- Name, socials, follow, bio -->
				<div class="flex flex-row justify-between p-4" style="margin-left: 22px; margin-right: 22px">
					<div class="flex items-center">
						<Avatar :avatar="avatar" :authorID="$route.params.id" size="w-24 h-24" class="mr-4" />
						<div class="flex flex-col">
							<!-- Name Username, Follow button -->
							<div class="flex flex-col">
								<h3
									class="text-xl pr-4"
									:class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
								>
									{{ currentUser.name }}
								</h3>
								<h5
									:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
									class="text-lightSecondary text-lg"
								>
									@{{ currentUser.id }}
								</h5>
							</div>
							<div class="flex flex-row">
								<!-- Categories, following, followers -->
								<nuxt-link :to="'/' + $route.params.id + '/categories'" :class="getStyles(`id-categories`)">
									<span class="font-bold">0</span>
									categories
								</nuxt-link>
								<nuxt-link :to="'/' + $route.params.id + '/followers'" :class="getStyles(`id-followers`)" class="pl-4">
									<span class="font-bold">{{ followers }}</span>
									Followers
								</nuxt-link>
								<nuxt-link :to="'/' + $route.params.id + '/following'" :class="getStyles(`id-following`)" class="pl-4">
									<span class="font-bold">{{ following }}</span>
									Following
								</nuxt-link>
							</div>
						</div>
					</div>
					<div class="flex items-center"></div>
					<nuxt-link
						v-if="$store.state.session.id === $route.params.id"
						to="/settings"
						:class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
					>
						<SettingsIcon />
					</nuxt-link>
					<FriendButton v-else :toggleFriend="toggleFriend" :following="userIsFollowed" />
				</div>
				<!-- Bio -->
				<div
					style="margin-left: 22px; margin-right: 22px"
					class="px-4 pb-4"
					:class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
				>
					<p class="italic">
						{{ currentUser.bio }}
					</p>
					<span v-for="s in currentUser.socials" :key="s.platform" class="p-2">
						<!-- Twitter -->
						<button
							v-if="s.platform === 'twitter'"
							class="focus:outline-none text-primary"
							@click="openWindow('https://twitter.com/' + s.username)"
						>
							<TwitterIcon />
						</button>
						<!-- GitHub -->
						<button
							v-if="s.platform === 'github'"
							class="focus:outline-none text-primary"
							@click="openWindow('https://github.com/' + s.username)"
						>
							<GitHubIcon />
						</button>
						<button
							v-if="s.platform === 'website'"
							class="focus:outline-none text-primary"
							@click="openWindow(s.username)"
						>
							<ExternalURLIcon />
						</button>
					</span>
				</div>
				<div
					class="flex flex-col md:flex-row w-full justify-between border-b text-gray7"
					style="padding-left: 22px; padding-right: 22px"
				>
					<nuxt-link :to="'/' + $route.params.id" class="pb-1" :class="getStyles('id')">
						<span class="px-4">Posts</span>
					</nuxt-link>
					<nuxt-link :to="'/' + $route.params.id + '/comments'" class="pb-1" :class="getStyles('id-comments')">
						<span class="px-4">Comments</span>
					</nuxt-link>
					<nuxt-link :to="'/' + $route.params.id + '/bookmarks'" class="pb-1" :class="getStyles('id-bookmarks')">
						<span class="px-4">Bookmarks </span>
					</nuxt-link>
					<nuxt-link :to="'/' + $route.params.id + '/reposts'" class="pb-1" :class="getStyles('id-reposts')">
						<span class="px-4">Reposts</span>
					</nuxt-link>
				</div>
			</article>
			<article style="padding-top: 175.069px">
				<nuxt-child :profile="currentUser" :updateFollowers="updateFollowers" style="padding-left: 22px" />
			</article>
		</div>
		<div v-else style="width: 660px" class="flex justify-center">
			<div class="loader m-5"></div>
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import Avatar from '@/components/Avatar.vue'
import TwitterIcon from '@/components/icons/brands/Twitter.vue'
import GitHubIcon from '@/components/icons/brands/GitHub.vue'
import FriendButton from '@/components/FriendButton.vue'
import ExternalURLIcon from '@/components/icons/ExternalURL.vue'
import SettingsIcon from '@/components/icons/Settings.vue'

import { Post } from '@/backend/post'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'
import { followChange, getFollowersAndFollowing } from '@/backend/following'

interface IData {
	avatar: string
	currentUser: Profile | null
	posts: Post[]
	followers: number
	following: number
	userIsFollowed: boolean
}

export default Vue.extend({
	name: `RootIDPage`,
	components: {
		Avatar,
		TwitterIcon,
		GitHubIcon,
		FriendButton,
		ExternalURLIcon,
		SettingsIcon,
	},
	data(): IData {
		return {
			avatar: ``,
			currentUser: null,
			followers: 0,
			following: 0,
			posts: [],
			userIsFollowed: false,
		}
	},
	async created() {
		// Get user profile
		this.currentUser = await getProfile(this.$route.params.id)
		if (this.currentUser && this.currentUser.avatar !== ``) {
			getPhotoFromIPFS(this.currentUser.avatar).then((p) => {
				this.avatar = p
			})
		}
		getFollowersAndFollowing(this.$route.params.id).then(({ followers, following }) => {
			this.followers = followers.size
			this.following = following.size
			this.userIsFollowed = followers.has(this.$store.state.session.id)
		})
	},
	methods: {
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
					res += ` border-b-2`
				}
			} else {
				if (
					this.$route.name !== `id-followers` &&
					this.$route.name !== `id-following` &&
					this.$route.name !== `id-categories`
				) {
					res += ` text-gray7`
				}
				res += ` text-lightPrimaryText`
			}
			return res
		},
		openWindow(url: string) {
			if (process.client) {
				window.open(url, `_blank`)
			}
		},
		async toggleFriend() {
			await followChange(
				this.userIsFollowed ? `UNFOLLOW` : `FOLLOW`,
				this.$store.state.session.id,
				this.$route.params.id,
			)
			this.updateFollowers()
		},
		async updateFollowers() {
			const { followers, following } = await getFollowersAndFollowing(this.$route.params.id, true)
			this.followers = followers.size
			this.following = following.size
			this.userIsFollowed = followers.has(this.$store.state.session.id)
		},
	},
})
</script>
