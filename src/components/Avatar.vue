<template>
	<button class="focus:outline-none" @click="$router.push('/' + $props.authorID)">
		<img
			v-if="$props.avatar !== `` && $props.avatar !== null"
			:src="$props.avatar"
			class="rounded-lg object-cover"
			:class="size"
		/>
		<img v-else :src="avatarList[usernameToPicture($props.authorID)]" class="rounded-lg object-cover" :class="size" />
	</button>
</template>

<script lang="ts">
import Vue from 'vue'
import { avatars } from '@/config'

interface IData {
	avatarList: Array<any>
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
			default: `w-12 h-12`,
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
