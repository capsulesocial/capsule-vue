<template>
	<section class="w-full">
		<div>
			<!-- Fixed top -->
			<article ref="topContainer" class="fixed bg-white pt-5 -mt-5 z-20" style="width: 700px">
				<!-- Name, socials, follow, bio -->
				<div class="flex flex-row justify-between px-4 pt-4">
					<div class="flex items-center">
						<Avatar :avatar="visitAvatar" :authorID="$route.params.id" size="w-24 h-24" class="mr-4" />
						<div class="flex flex-col flex-grow">
							<!-- Name Username, Follow button -->
							<div class="flex flex-col">
								<h3 class="text-xl pr-4 font-semibold">
									{{ visitProfile.name }}
								</h3>
								<h5 class="text-primary text-lg">@{{ visitProfile.id }}</h5>
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
									<span class="font-bold text-primary">{{ followers.size }}</span>
									Followers
								</nuxt-link>
								<nuxt-link
									:to="'/' + $route.params.id + '/following'"
									:class="getStyles(`id-following`)"
									class="pl-4 text-base"
								>
									<span class="font-bold text-primary">{{ following.size }}</span>
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
						<FriendButton v-else :toggleFriend="toggleFriend" :userIsFollowed="userIsFollowed" />
					</div>
				</div>
				<!-- Bio -->
				<div v-if="visitProfile.bio" class="pt-4 pl-4">
					<p class="italic">
						{{ visitProfile.bio }}
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
			<article v-if="loadedContent()" :style="padding">
				<nuxt-child :profile="visitProfile" :updateFollowers="updateFollowers" :followers="followers" />
			</article>
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import Avatar from '@/components/Avatar.vue'
import FriendButton from '@/components/FriendButton.vue'
import BrandedButton from '@/components/BrandedButton.vue'

import { Post } from '@/backend/post'
import { Profile } from '@/backend/profile'

interface IData {
	posts: Post[]
	padding: string
}

export default Vue.extend({
	name: `RootIDPage`,
	components: {
		Avatar,
		FriendButton,
		BrandedButton,
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
	},
	data(): IData {
		return {
			posts: [],
			padding: `0px`,
		}
	},
	mounted() {
		// @ts-ignore
		this.padding = `padding-top: ` + this.$refs.topContainer.clientHeight + `px`
	},
	methods: {
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
	},
})
</script>
