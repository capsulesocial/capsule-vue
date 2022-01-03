<template>
	<button class="rounded-lg focus:outline-none" @click="toggleFriend">
		<div v-if="userIsFollowed">
			<div v-if="showIcons" class="rounded-full p-3 items-center">
				<UnfollowIcon />
			</div>
			<div
				v-else
				class="friendbtn inline text-grey5 transition ease-in-out bg-white hover:bg-black hover:text-white duration-300 text-sm shadow-lg px-5 font-semibold rounded-lg"
				style="padding-top: 0.4rem; padding-bottom: 0.4rem"
			>
				<span class="following">Following</span>
				<span class="unfollow">Unfollow</span>
			</div>
		</div>
		<div v-else>
			<div v-if="showIcons" class="shadow-lg rounded-full bg-primary p-3 items-center">
				<FollowIcon class="text-white" />
			</div>
			<span
				v-else
				class="text-white font-semibold rounded-lg text-sm shadow-lg px-5 transition ease-in-out bg-secondary hover:bg-primary duration-300"
				style="padding-top: 0.4rem; padding-bottom: 0.4rem"
				>Follow</span
			>
		</div>
	</button>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import FollowIcon from '@/components/icons/Follow.vue'
import UnfollowIcon from '@/components/icons/Unfollow.vue'

export default Vue.extend({
	components: {
		FollowIcon,
		UnfollowIcon,
	},
	props: {
		userIsFollowed: {
			type: Boolean,
			required: true,
		},
		showIcons: {
			type: Boolean,
			default: false,
		},
		toggleFriend: {
			type: Function as PropType<() => void>,
			required: true,
		},
	},
})
</script>

<style scoped>
div.friendbtn span.following {
	display: inline;
}
div.friendbtn:hover span.following {
	display: none;
}
div.friendbtn span.unfollow {
	display: none;
}
div.friendbtn:hover span.unfollow {
	display: inline;
}
</style>
