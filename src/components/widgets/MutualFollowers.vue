<template>
	<article
		v-if="mutuals.size !== 0"
		class="mb-5 w-full rounded-lg bg-gradient-to-r from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder p-4 shadow-lg"
	>
		<h6 class="text-lightPrimaryText dark:text-darkPrimaryText mb-2 font-semibold">Mutual Followers</h6>
		<div>
			<!-- Profile photos -->
			<div class="flex flex-row flex-wrap pl-4">
				<Avatar
					v-for="f in featuredProfiles"
					:key="f.id"
					:authorID="f.id"
					:avatar="f.avatar"
					:size="`w-10 h-10`"
					class="-ml-4 rounded-xl bg-white dark:bg-transparent p-1"
				/>
			</div>
			<!-- Names -->
			<div v-if="featuredProfiles">
				<p class="text-gray5 dark:text-gray3 mb-4 mt-1 text-sm">
					{{ getText() }}
				</p>
			</div>
		</div>
		<button class="text-primary text-sm" @click="$emit(`openMutuals`)">Show more</button>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import Avatar from '@/components/Avatar.vue'

import { Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/getPhoto'

interface IData {
	profiles: Array<Profile>
	featuredProfiles: Array<{ id: string; avatar: string }>
}

export default Vue.extend({
	components: {
		Avatar,
	},
	props: {
		mutuals: {
			type: Set,
			required: true,
		},
		mutualProfiles: {
			type: Array,
			required: true,
		},
	},
	data(): IData {
		return {
			profiles: [],
			featuredProfiles: [],
		}
	},
	watch: {
		mutualProfiles(newValue) {
			this.getPairings(newValue)
		},
	},
	methods: {
		getPairings(newValue: Array<{ id: string; avatar: string }>) {
			const list = newValue
			const res = []
			for (const p of list) {
				const item = { id: ``, avatar: `` }
				item.id = p.id
				getPhotoFromIPFS(p.avatar).then((img) => {
					item.avatar = img
				})
				res.push(item)
			}
			this.featuredProfiles = res
		},
		getText(): string {
			const len = this.featuredProfiles.length
			switch (len) {
				case 0:
					return `No mutual followers`
				case 1:
					return `Followed by ` + this.featuredProfiles[0].id
				case 2:
					return `Followed by ` + this.featuredProfiles[0].id + ` and ` + this.featuredProfiles[1].id
				case 3:
					return (
						`Followed by ` +
						this.featuredProfiles[0].id +
						`, ` +
						this.featuredProfiles[1].id +
						`, and ` +
						this.featuredProfiles[2].id
					)
				default:
					return (
						`Followed by ` +
						this.featuredProfiles[0].id +
						`, ` +
						this.featuredProfiles[1].id +
						`, ` +
						this.featuredProfiles[2].id +
						`, and ` +
						(len - 3) +
						` others you follow`
					)
			}
		},
	},
})
</script>
