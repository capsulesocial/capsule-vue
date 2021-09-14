<template>
	<section class="w-full border-l border-r">
		<!-- IF a profile exists -->
		<div v-if="this.currentUser" style="width: 600px">
			<!-- Name, socials, follow, bio -->
			<section class="flex flex-row justify-between p-4" style="margin-left: 22px; margin-right: 22px">
				<article class="flex items-center">
					<img
						v-if="this.currentUser.avatar !== `` && this.currentUser.avatar !== null"
						:src="this.avatar"
						class="w-24 h-24 rounded-lg mr-4 object-cover"
					/>
					<ProfileIcon v-else class="w-24 h-24 rounded-full mr-4 border" />
					<div class="flex flex-col">
						<!-- Name Username, Follow button -->
						<div class="flex flex-col">
							<h3
								class="text-xl pr-4"
								:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
							>
								{{ this.currentUser.name }}
							</h3>
							<h5
								:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
								class="text-lightSecondary text-lg"
							>
								@{{ this.currentUser.id }}
							</h5>
						</div>
						<div class="flex flex-row">
							<!-- Categories, following, followers -->
							<nuxt-link
								:to="'/' + this.$route.params.id + '/categories'"
								:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
							>
								<span class="font-bold">0</span>
								<span
									:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
								>
									categories
								</span>
							</nuxt-link>
							<nuxt-link
								:to="'/' + this.$route.params.id + '/followers'"
								:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
								class="pl-4"
							>
								<span class="font-bold">{{ this.followers }}</span>
								<span
									:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
								>
									Followers
								</span>
							</nuxt-link>
							<nuxt-link
								:to="'/' + this.$route.params.id + '/following'"
								:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
								class="pl-4"
							>
								<span class="font-bold">{{ this.following }}</span>
								<span
									:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
								>
									Following
								</span>
							</nuxt-link>
						</div>
					</div>
				</article>
				<div class="flex items-center"></div>
				<nuxt-link
					v-if="this.$store.state.session.id === this.$route.params.id"
					to="/settings"
					:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
				>
					<SettingsIcon />
				</nuxt-link>
				<FriendButton v-else :authorID="this.$route.params.id" />
			</section>
			<!-- Bio -->
			<section
				style="margin-left: 22px; margin-right: 22px"
				class="px-4 pb-4"
				:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
			>
				<p class="italic">
					{{ this.currentUser.bio }}
				</p>
				<span v-for="s in this.currentUser.socials" :key="s.platform" class="p-2">
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
			</section>

			<article
				class="flex flex-col md:flex-row w-full justify-between border-b text-gray7"
				style="padding-left: 22px; padding-right: 22px"
			>
				<nuxt-link :to="'/' + this.$route.params.id" class="pb-1" :class="this.getStyles('id')">
					<span class="px-4">Posts</span>
				</nuxt-link>
				<nuxt-link :to="'/' + this.$route.params.id + '/comments'" class="pb-1" :class="this.getStyles('id-comments')">
					<span class="px-4">Comments</span>
				</nuxt-link>
				<nuxt-link
					:to="'/' + this.$route.params.id + '/bookmarks'"
					class="pb-1"
					:class="this.getStyles('id-bookmarks')"
				>
					<span class="px-4">Bookmarks </span>
				</nuxt-link>
				<nuxt-link :to="'/' + this.$route.params.id + '/reposts'" class="pb-1" :class="this.getStyles('id-reposts')">
					<span class="px-4">Reposts</span>
				</nuxt-link>
			</article>
			<article>
				<nuxt-child :profile="this.currentUser" style="padding-left: 22px" />
			</article>
		</div>
		<div v-else style="width: 600px" class="flex justify-center">
			<div class="loader m-5"></div>
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import ProfileIcon from '@/components/icons/Person.vue'
import TwitterIcon from '@/components/icons/brands/Twitter.vue'
import GitHubIcon from '@/components/icons/brands/GitHub.vue'
import FriendButton from '@/components/FriendButton.vue'
import ExternalURLIcon from '@/components/icons/ExternalURL.vue'
import SettingsIcon from '@/components/icons/Settings.vue'

import { Post } from '@/backend/post'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'
import { getFollowersAndFollowing } from '@/backend/following'

interface IData {
	avatar: string
	currentUser: Profile | null
	posts: Post[]
	followers: number
	following: number
}

export default Vue.extend({
	name: `RootIDPage`,
	components: {
		ProfileIcon,
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
		const { followers, following } = await getFollowersAndFollowing(this.$route.params.id)
		this.followers = followers.size
		this.following = following.size
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
				res += ` text-primary font-bold border-b-2`
			} else {
				res += ` text-gray7`
			}
			return res
		},
		openWindow(url: string) {
			if (process.client) {
				window.open(url, `_blank`)
			}
		},
	},
})
</script>
