<template>
	<nuxt-link :to="'/' + $props.authorID">
		<img
			v-if="$props.avatar !== `` && $props.avatar !== null"
			:src="$props.getPhotoFromIPFS ? fetchedAvatar : $props.avatar"
			class="rounded-lg object-cover"
			:class="size"
		/>
		<img v-else :src="avatarList[usernameToPicture($props.authorID)]" class="rounded-lg object-cover" :class="size" />
	</nuxt-link>
</template>

<script lang="ts">
import Vue from 'vue'
import { avatars } from '@/config'
import { getPhotoFromIPFS } from '@/backend/photos'

interface IData {
	avatarList: Array<any>
	hasAvatar: boolean
	fetchedAvatar: string
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
		getPhotoFromIPFS: {
			type: Boolean,
			default: false,
		},
	},
	data(): IData {
		return {
			avatarList: avatars,
			hasAvatar: false,
			fetchedAvatar: ``,
		}
	},
	async created() {
		if (this.$props.getPhotoFromIPFS) {
			this.fetchedAvatar = await getPhotoFromIPFS(this.avatar)
		}
	},
	methods: {
		usernameToPicture(username: string, buckets: number = 7): number {
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
