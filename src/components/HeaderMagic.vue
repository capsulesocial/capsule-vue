<template>
	<header class="page-header flex items-center bg-white">
		<nav>
			<div
				class="
					trigger-menu-wrapper
					fixed
					flex
					justify-center
					top-0
					left-0
					right-0
					bg-white
					py-4
					transform-none
					border-b
				"
			>
				<div class="md:min-w-max md:max-w-3xl w-full pl-5 flex justify-between">
					<div class="items-center flex">
						<Avatar :avatar="avatar" :authorID="authorID" size="w-10 h-10" class="mr-4" />
						<nuxt-link :to="`/` + authorID" class="pr-4 text-lg">@{{ authorID }}</nuxt-link>
						<FriendButton
							v-if="authorID !== $store.state.session.id"
							:following="userIsFollowed"
							:toggleFriend="toggleFriend"
						/>
					</div>
					<button class="flex items-center bg-lightSecondary rounded-full p-2 focus:outline-none" @click="handleClose">
						<XIcon />
					</button>
				</div>
			</div>
		</nav>
	</header>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import XIcon from '@/components/icons/X.vue'
import FriendButton from '@/components/FriendButton.vue'
import Avatar from '@/components/Avatar.vue'

export default Vue.extend({
	components: {
		XIcon,
		FriendButton,
		Avatar,
	},
	props: {
		authorID: {
			type: String,
			default: `username`,
		},
		avatar: {
			type: String as PropType<string | ArrayBuffer | null>,
			default: null,
		},
		userIsFollowed: {
			type: Boolean,
			default: false,
		},
		toggleFriend: {
			type: Function as PropType<() => void>,
			required: true,
		},
	},
	data() {
		return {
			lastScroll: 0,
			showHeader: true,
		}
	},
	mounted() {
		// Hide header on scroll down
		window.addEventListener(`scroll`, this.handleScroll)
	},
	destroyed() {
		window.removeEventListener(`scroll`, this.handleScroll)
	},
	methods: {
		handleScroll() {
			const body = document.body
			const scrollUp = `scroll-up`
			const scrollDown = `scroll-down`
			const currentScroll = window.pageYOffset
			if (currentScroll <= 0) {
				body.classList.remove(scrollUp)
				return
			}
			if (currentScroll > this.lastScroll && !body.classList.contains(scrollDown)) {
				// down
				body.classList.remove(scrollUp)
				body.classList.add(scrollDown)
			} else if (currentScroll < this.lastScroll && body.classList.contains(scrollDown)) {
				// up
				body.classList.remove(scrollDown)
				body.classList.add(scrollUp)
			}
			this.lastScroll = currentScroll
		},
		handleClose() {
			// @ts-ignore
			if (this.$router.history._startLocation === this.$route.path) {
				// IF they started on this page:
				this.$router.push(`/home`)
			} else if (this.$store.state.settings.recentlyPosted) {
				// IF coming from after recently posting:
				this.$router.push(`/` + this.$store.state.session.id)
				this.$store.commit(`settings/setRecentlyPosted`, false)
			} else {
				this.$router.go(-1)
			}
		},
	},
})
</script>

<style>
.trigger-menu-wrapper {
	transition: transform 0.4s;
	z-index: 50;
}

.page-header {
	transition: transform 0.3s;
}

.trigger-menu-wrapper {
	transition: transform 0.4s;
}

.scroll-down .trigger-menu-wrapper {
	transform: translate3d(0, -100%, 0);
}

.scroll-down {
	background: white;
}

.scroll-up {
	transform: none;
}

.scroll-up:not(.menu-open) .trigger-menu-wrapper {
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.35);
}
</style>
