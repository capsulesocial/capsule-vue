<template>
	<section class="p-4 w-full">
		<!-- IF a profile exists -->
		<div v-if="this.currentUser">
			<!-- Name, socials, follow, bio -->
			<section class="flex flex-row justify-between">
				<article class="flex items-center">
					<img
						v-if="this.currentUser.avatar !== `` && this.currentUser.avatar !== null"
						:src="this.avatar"
						class="w-16 h-16 rounded-lg mr-4 object-cover"
					/>
					<div class="flex flex-col">
						<!-- Name Username, Follow button -->
						<div class="flex flex-row items-center">
							<h3
								class="text-2xl pr-4"
								:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
							>
								{{ this.currentUser.name }}
							</h3>
							<h5
								:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
								class="text-xl text-gray-700"
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
								<!-- {{ this.currentUser.categories.length }} -->0
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
								<!-- {{ this.currentUser.followers.length }} -->0
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
								<!-- {{ this.currentUser.following.length }} -->0
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

			<section :class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'">
				<p class="text-sm italic py-2">
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

			<article class="flex flex-col md:flex-row w-full justify-between border-b">
				<nuxt-link
					:to="'/' + this.$route.params.id"
					class="text-gray5 font-bold px-2 pb-1"
					:class="this.getStyles('id')"
				>
					Posts
				</nuxt-link>
				<nuxt-link
					:to="'/' + this.$route.params.id + '/comments'"
					class="text-gray5 font-bold px-2 pb-1"
					:class="this.getStyles('id-comments')"
				>
					Comments
				</nuxt-link>
				<nuxt-link
					:to="'/' + this.$route.params.id + '/bookmarks'"
					class="text-gray5 font-bold px-2 pb-1"
					:class="this.getStyles('id-bookmarks')"
				>
					Bookmarks
				</nuxt-link>
				<nuxt-link
					:to="'/' + this.$route.params.id + '/reposts'"
					class="font-bold px-2 pb-1"
					:class="this.getStyles('id-reposts')"
				>
					Reposts
				</nuxt-link>
			</article>
			<article>
				<nuxt-child :profile="this.currentUser" />
			</article>
		</div>
		<div v-else class="flex justify-center mt-32">
			<div class="loader m-10"></div>
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import TwitterIcon from '@/components/icons/brands/Twitter.vue'
import GitHubIcon from '@/components/icons/brands/GitHub.vue'
import FriendButton from '@/components/FriendButton.vue'
import ExternalURLIcon from '@/components/icons/ExternalURL.vue'
import SettingsIcon from '@/components/icons/Settings.vue'
import { Profile } from '@/interfaces/Profile'
import { Post } from '@/interfaces/Post'

interface IData {
	avatar: string
	currentUser: Profile | null
	posts: Post[]
}

export default Vue.extend({
	name: `RootIDPage`,
	components: {
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
			posts: [],
		}
	},
	async created() {
		// Get user profile
		const res = await this.$getProfileNEAR(this.$route.params.id)
		if (res.success) {
			const profile = await this.$getProfile(res.profileCID)
			this.currentUser = profile
			if (profile.avatar !== ``) {
				this.avatar = await this.$getPhoto(profile.avatar)
			}
		}
	},
	methods: {
		getStyles(tab: string): string {
			let res = ``
			if (this.$store.state.settings.darkMode) {
				res += `text-lightSecondaryText border-lightActive`
			} else {
				res += `text-darkSecondaryText border-darkActive`
			}
			if (this.$route.name === tab) {
				res += ` border-b-2`
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
