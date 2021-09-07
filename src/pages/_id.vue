<template>
	<section class="w-full border-l border-r">
		<!-- IF a profile exists -->
		<div v-if="this.currentUser" style="width: 600px">
			<!-- Name, socials, follow, bio -->
			<section class="flex flex-row justify-between p-4">
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
								<span class="font-bold"><!-- {{ this.currentUser.categories.length }} -->0</span>
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
								<span class="font-bold"><!-- {{ this.currentUser.followers.length }} -->0</span>
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
								<span class="font-bold"><!-- {{ this.currentUser.following.length }} -->0</span>
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

			<section
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

			<article class="flex flex-col md:flex-row w-full justify-between border-b px-4 text-gray7">
				<nuxt-link :to="'/' + this.$route.params.id" class="px-2 pb-1" :class="this.getStyles('id')"> Posts </nuxt-link>
				<nuxt-link
					:to="'/' + this.$route.params.id + '/comments'"
					class="px-2 pb-1"
					:class="this.getStyles('id-comments')"
				>
					Comments
				</nuxt-link>
				<nuxt-link
					:to="'/' + this.$route.params.id + '/bookmarks'"
					class="px-2 pb-1"
					:class="this.getStyles('id-bookmarks')"
				>
					Bookmarks
				</nuxt-link>
				<nuxt-link
					:to="'/' + this.$route.params.id + '/reposts'"
					class="px-2 pb-1"
					:class="this.getStyles('id-reposts')"
				>
					Reposts
				</nuxt-link>
			</article>
			<article>
				<nuxt-child :profile="this.currentUser" style="padding-left: 11px" />
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
import { Profile } from '@/interfaces/Profile'
import { Post } from '@/interfaces/Post'
import ipfs from '@/backend/ipfs'
import { getProfile } from '@/backend/profile'

interface IData {
	avatar: string
	currentUser: Profile | null
	posts: Post[]
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
			posts: [],
		}
	},
	async created() {
		// Get user profile
		this.currentUser = await getProfile(this.$route.params.id)
		if (this.currentUser.avatar !== ``) {
			ipfs()
				.getPhoto(this.currentUser.avatar)
				.then((p) => {
					this.avatar = p
				})
		}
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
