<template>
	<header class="page-header flex items-center bg-white z-30">
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
				<div class="md:min-w-max md:max-w-3xl w-full pl-10 pr-5 flex justify-between">
					<div class="items-center flex">
						<img :src="this.$props.avatar" class="w-10 h-10 rounded-xl mr-4" />
						<nuxt-link :to="`/` + this.$props.authorID" class="pr-4 text-lg">@{{ this.$props.authorID }}</nuxt-link>
						<FriendButton :authorID="this.$props.authorID" />
					</div>
					<button
						class="flex items-center bg-lightSecondary rounded-full p-2 focus:outline-none"
						@click="$router.go(-1)"
					>
						<XIcon />
					</button>
				</div>
			</div>
		</nav>
	</header>
</template>

<script lang="ts">
import Vue from 'vue'
import XIcon from '@/components/icons/X.vue'
import FriendButton from '@/components/FriendButton.vue'

export default Vue.extend({
	components: {
		XIcon,
		FriendButton,
	},
	props: {
		authorID: {
			type: String,
			default: `username`,
		},
		avatar: {
			type: String,
			default: null,
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
	},
})
</script>

<style>
.trigger-menu-wrapper {
	transition: transform 0.4s;
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
