<template>
	<button v-if="!noClick" class="focus:outline-none" @click="$router.push('/id/' + authorID)">
		<img
			v-if="avatar !== `` && avatar !== null"
			:src="avatar"
			class="border-lightBorder rounded-lg border object-cover"
			:class="size"
		/>
		<img
			v-else
			:src="avatarList[usernameToPicture(authorID)]"
			class="border-lightBorder rounded-lg border object-cover"
			:class="size"
		/>
	</button>
	<span v-else>
		<img
			v-if="avatar !== `` && avatar !== null"
			:src="avatar"
			class="border-lightBorder rounded-lg border object-cover"
			:class="size"
		/>
		<img
			v-else
			:src="avatarList[usernameToPicture(authorID)]"
			class="border-lightBorder rounded-lg border object-cover"
			:class="size"
		/>
	</span>
</template>

<script lang="ts">
import Vue from 'vue'
import { avatars } from '@/config/avatars'

interface IData {
	avatarList: Array<unknown>
	hasAvatar: boolean
}

export default Vue.extend({
	props: {
		avatar: {
			type: String,
			default: ``,
		},
		authorID: {
			type: String,
			default: ``,
		},
		size: {
			type: String,
			default: `w-10 h-10`,
		},
		noClick: {
			type: Boolean,
			default: false,
		},
	},
	data(): IData {
		return {
			avatarList: avatars,
			hasAvatar: false,
		}
	},
	methods: {
		usernameToPicture(username: string, buckets: number = 11): number {
			let x = 0
			for (let i = 0; i < username.length; i++) {
				x += username.charCodeAt(i)
			}
			const v = ((Math.sin(x) + 1) * (buckets - 1)) / 2
			return Math.floor(v)
		},
	},
})
</script>
