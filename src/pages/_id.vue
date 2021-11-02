<template>
	<section class="w-full">
		<!-- IF a profile exists -->
		<div v-if="currentUser">
			<!-- Fixed top -->
			<article class="fixed bg-white pt-5 -mt-5 z-20" style="width: 700px">
				<!-- Name, socials, follow, bio -->
				<div class="flex flex-row justify-between px-4 pt-4">
					<div class="flex items-center">
						<Avatar :avatar="avatar" :authorID="$route.params.id" size="w-24 h-24" class="mr-4" />
						<div class="flex flex-col flex-grow">
							<!-- Name Username, Follow button -->
							<div class="flex flex-col">
								<h3 class="text-xl pr-4 font-semibold">
									{{ currentUser.name }}
								</h3>
								<h5 class="text-primary text-lg">@{{ currentUser.id }}</h5>
							</div>
							<div class="flex flex-row pt-1 text-sm text-gray6">
								<!-- posts, following, followers -->
								<nuxt-link :to="'/' + $route.params.id" class="text-base" :class="getStyles(`id-categories`)">
									<span class="font-bold text-primary">X</span>
									Posts
								</nuxt-link>
								<nuxt-link
									:to="'/' + $route.params.id + '/followers'"
									:class="getStyles(`id-followers`)"
									class="pl-4 text-base"
								>
									<span class="font-bold text-primary">{{ followers }}</span>
									Followers
								</nuxt-link>
								<nuxt-link
									:to="'/' + $route.params.id + '/following'"
									:class="getStyles(`id-following`)"
									class="pl-4 text-base"
								>
									<span class="font-bold text-primary">{{ following }}</span>
									Following
								</nuxt-link>
							</div>
						</div>
					</div>
					<div class="flex items-center">
						<BrandedButton
							v-if="$store.state.session.id === $route.params.id"
							:text="`Edit Profile`"
							:action="
								() => {
									$router.push(`/settings`)
								}
							"
						/>
						<FriendButton v-else :toggleFriend="toggleFriend" :following="userIsFollowed" />
					</div>
				</div>
				<!-- Bio -->
				<div v-if="currentUser.bio" class="pt-4 pl-4">
					<p class="italic">
						{{ currentUser.bio }}
					</p>
				</div>
				<div class="flex flex-col md:flex-row w-full justify-between border-b text-gray7 pt-4">
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
			<article class="pt-24">
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
import FriendButton from '@/components/FriendButton.vue'
import BrandedButton from '@/components/BrandedButton.vue'

import { Post } from '@/backend/post'
import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
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
		FriendButton,
		BrandedButton,
	},
	layout: `profile`,
	asyncData({ params }) {
		return {
			id: params.id,
		}
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
	watch: {
		$route() {
			location.reload()
		},
	},
	async created() {
		// Get user profile
		this.currentUser = createDefaultProfile(this.$route.params.id)
		const fetchedProfile = await getProfile(this.$route.params.id, true)
		if (fetchedProfile) {
			this.currentUser = fetchedProfile
		}
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
