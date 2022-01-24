<template>
	<button class="focus:outline-none block rounded-lg" @click="toggleFriend">
		<div v-if="userIsFollowed">
			<!-- Desktop -->
			<div
				class="friendbtn text-grey5 hidden rounded-lg bg-white px-5 text-sm font-semibold shadow-lg transition duration-300 ease-in-out hover:bg-black hover:text-white xl:inline"
				style="padding-top: 0.4rem; padding-bottom: 0.4rem"
			>
				<span class="following">Following</span>

				<span class="unfollow">Unfollow</span>
			</div>
			<!-- Mobile -->
			<div class="friendbtn text-grey5 rounded-lg p-1 shadow-lg transition duration-300 ease-in-out xl:hidden">
				<FriendRemoveIcon class="m-1 h-5 w-5" />
			</div>
		</div>
		<div v-else>
			<!-- Desktop -->
			<span
				class="bg-secondary hover:bg-primary hidden rounded-lg px-5 text-sm font-semibold text-white shadow-lg transition duration-300 ease-in-out xl:inline"
				style="padding-top: 0.4rem; padding-bottom: 0.4rem"
				>Follow</span
			>
			<!-- Mobile -->
			<div class="bg-secondary rounded-lg p-1 text-white shadow-lg transition duration-300 ease-in-out xl:hidden">
				<FriendAddIcon class="m-1 h-5 w-5" />
			</div>
		</div>
	</button>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import FriendAddIcon from '@/components/icons/FriendAdd.vue'
import FriendRemoveIcon from '@/components/icons/FriendRemove.vue'

export default Vue.extend({
	components: {
		FriendAddIcon,
		FriendRemoveIcon,
	},
	props: {
		userIsFollowed: {
			type: Boolean,
			required: true,
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
