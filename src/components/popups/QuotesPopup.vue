<template>
	<div
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="$emit(`close`)"
	>
		<!-- Container -->
		<div
			v-if="postCID !== null"
			class="popup min-h-40 w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg px-6 pt-4 pb-2 shadow-lg"
		>
			<div class="sticky flex items-center justify-between mb-6">
				<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-3xl font-semibold">Quoted this post</h2>
				<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="$emit(`close`)">
					<CloseIcon />
				</button>
			</div>
			<div v-show="isLoading" class="modal-animation flex w-full justify-center z-20 mt-24">
				<div
					class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
					:style="`border-top: 2px solid` + $color.hex"
				></div>
			</div>
			<article v-if="!isLoading">
				<div v-for="p in quoteReposts" :key="p.authorID + p.timestamp" class="flex flex-col">
					<div class="flex items-center">
						<Avatar :avatar="p.avatar" :authorID="p.authorID" size="w-12 h-12" />
						<div class="h-12 flex flex-col px-4">
							<nuxt-link :to="`/id/` + p.authorID" class="flex items-center">
								<span v-if="p.name != ``" class="text-base font-medium text-lightPrimaryText dark:text-darkPrimaryText">
									{{ p.name }}
								</span>
								<span v-else class="text-gray5 dark:text-gray3 text-base font-medium"> {{ p.authorID }} </span>
								<span class="text-gray5 dark:text-gray3 text-sm ml-2">@{{ p.authorID }}</span>
							</nuxt-link>
							<span class="mt-1 text-xs text-gray5 dark:text-gray3">{{ $formatDate(p.timestamp) }}</span>
						</div>
					</div>
					<div
						class="my-4 pb-4 border-b border-lightBorder dark:border-darkBorder text-lightPrimaryText dark:text-darkPrimaryText"
					>
						{{ p.content }}
					</div>
				</div>
			</article>
			<p v-if="!isLoading && quoteReposts.length === 0" class="text-sm text-gray5 dark:text-gray3 text-center mt-14">
				None of the reposters quoted this post
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import CloseIcon from '@/components/icons/X.vue'
import Avatar from '@/components/Avatar.vue'
import { getReposts, IGetRepostsOptions } from '@/backend/reposts'
import { getRegularPost } from '@/backend/post'

import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/getPhoto'

interface IData {
	isLoading: boolean
	profiles: Array<Profile>
	quoteReposters: Array<string>
	quoteReposts: Array<any>
	followers: Set<string>
}

export default Vue.extend({
	components: { CloseIcon, Avatar },
	props: {
		postCID: {
			type: String,
			required: true,
		},
	},
	data(): IData {
		return {
			isLoading: true,
			profiles: [],
			quoteReposters: [],
			quoteReposts: [],
			followers: new Set(),
		}
	},
	created() {
		this.getQuoteReposts()
	},
	methods: {
		updateFollowers(): void {
			this.$emit(`updateFollowers`)
		},

		async getReposterProfile(p: string) {
			let profile = createDefaultProfile(p)
			await getProfile(p).then((fetchedProfile) => {
				if (fetchedProfile.profile) {
					profile = fetchedProfile.profile
				}
				if (profile.avatar !== ``) {
					getPhotoFromIPFS(profile.avatar).then((avatar) => {
						profile.avatar = avatar
					})
				}
			})
			return profile
		},
		async getQuoteReposts() {
			const options: IGetRepostsOptions = { sort: `NEW`, offset: 0, limit: 1000, type: `quote` }
			const reposts = await getReposts({ postCID: this.postCID }, options)
			reposts.forEach((repost) => {
				this.fetchQuote(repost.repost._id, repost.repost.authorID)
			})
			this.isLoading = false
		},
		async fetchQuote(cid: string, authorID: string) {
			const { data: content } = await getRegularPost(cid)
			const profile = await this.getReposterProfile(authorID)
			const q = {
				content: content.content,
				timestamp: content.timestamp,
				authorID: content.authorID,
				name: profile.name,
				avatar: profile.avatar,
			}
			this.quoteReposts.push(q)
		},
	},
})
</script>
