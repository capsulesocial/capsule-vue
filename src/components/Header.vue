<template>
	<div class="flex flex-row justify-between items-center">
		<!-- Left side: Links + write post button -->
		<nav class="flex flex-row items-center" style="font-size: 0.95rem">
			<nuxt-link to="/home" class="mr-5">
				<CapsuleIcon />
			</nuxt-link>
			<nuxt-link to="/home" class="mx-4" :class="getStyles(`home`)"> Home </nuxt-link>
			<nuxt-link to="/discover" class="mx-4" :class="getStyles(`discover`)"> Discover </nuxt-link>
			<nuxt-link to="/bookmarks" class="mx-4" :class="getStyles(`bookmarks`)"> Bookmarks </nuxt-link>
			<BrandedButton :text="`Write a Post`" :action="togglePostEditor" class="mx-4" />
		</nav>
		<!-- Right side: icons and avatar -->
		<div class="flex flex-row">
			<Avatar :avatar="avatar" :authorID="$store.state.session.id" />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import { keyStores } from 'near-api-js'

import CapsuleIcon from '@/components/icons/Capsule.vue'
import Avatar from '@/components/Avatar.vue'
import BrandedButton from '@/components/BrandedButton.vue'

import { MutationType, namespace as sessionStoreNamespace } from '~/store/session'

export default Vue.extend({
	components: {
		CapsuleIcon,
		Avatar,
		BrandedButton,
	},
	props: {
		avatar: {
			type: String,
			default: ``,
		},
		togglePostEditor: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {}
	},
	mounted() {},
	methods: {
		...mapMutations(sessionStoreNamespace, {
			endSession: MutationType.LOGOUT,
		}),
		getStyles(tab: string): string {
			let res: string = ``
			// Check if current tab
			if (this.$route.name === tab) {
				res += `font-bold text-primary border-primary border-b`
			} else {
				res += `font-regular text-gray5`
			}
			return res
		},
		logout() {
			this.endSession()
			window.localStorage.removeItem(`accountId`)
			const keystore = new keyStores.BrowserLocalStorageKeyStore()
			keystore.clear()
			this.$router.push(`/`)
		},
	},
})
</script>
