<template>
	<button class="rounded-lg focus:outline-none block" @click="toggleFriend">
		<div v-if="userIsFollowed">
			<!-- Desktop -->
			<div
				class="friendbtn hidden xl:inline text-grey5 transition ease-in-out bg-white hover:bg-black hover:text-white duration-300 text-sm shadow-lg px-5 font-semibold rounded-lg"
				style="padding-top: 0.4rem; padding-bottom: 0.4rem"
			>
				<span class="following">Following</span>

				<span class="unfollow">Unfollow</span>
			</div>
			<!-- Mobile -->
			<div class="friendbtn xl:hidden text-grey5 p-1 transition ease-in-out duration-300 shadow-lg rounded-lg">
				<FriendRemoveIcon class="w-5 h-5 m-1" />
			</div>
		</div>
		<div v-else>
			<!-- Desktop -->
			<span
				class="hidden xl:inline text-white font-semibold rounded-lg text-sm shadow-lg px-5 transition ease-in-out bg-secondary hover:bg-primary duration-300"
				style="padding-top: 0.4rem; padding-bottom: 0.4rem"
				>Follow</span
			>
			<!-- Mobile -->
			<div class="xl:hidden p-1 text-white rounded-lg shadow-lg transition ease-in-out bg-secondary duration-300">
				<FriendAddIcon class="w-5 h-5 m-1" />
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
