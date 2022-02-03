<template>
	<div
		class="bg-primary modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-start justify-center bg-opacity-50"
	>
		<div
			class="popupCard from-lightBGStart to-lightBGStop card-animation mt-12 overflow-y-auto rounded-lg bg-gradient-to-r p-6 pt-4 shadow-lg backdrop-blur-lg backdrop-filter"
			style="max-height: 90%; width: 650px; backdrop-filter: blur(10px)"
		>
			<!-- Header and close icon -->
			<div class="flex items-center justify-between pb-6">
				<h2 class="text-primary text-xl font-semibold">Configure Notifications</h2>
				<button class="bg-gray1 focus:outline-none rounded-full p-1" @click="closePopup"><CloseIcon /></button>
			</div>
			<!-- Self-view view -->
			<div v-if="$store.state.session.id === $route.params.id">
				<p class="text-gray7">
					Display highlighted tags on your profile for readers to enable email notifications to receive your posts. You
					can display up to three different tags:
				</p>
				<div class="grid grid-cols-5 mb-3">
					<!-- Add tag input -->
					<label for="tagInput" class="font-semibold col-span-1 mt-4">Tags</label>
					<div class="col-span-4 bg-gray1 rounded-lg px-4 py-2 my-4">
						<input
							id="tagInput"
							:ref="tagInput"
							type="text"
							placeholder="Add more specific topics to be notified on..."
							class="w-full text-gray7 bg-gray1 focus:outline-none"
						/>
					</div>
					<div class="col-span-1"></div>
					<div class="flex flex-row flex-wrap col-span-4">
						<button class="bg-gray2 rounded-lg flex items-center text-gray7 px-4 py-2 focus:outline-none mr-6">
							placeholder1
							<CloseIcon class="p-1" />
						</button>
						<button class="bg-gray2 rounded-lg flex items-center text-gray7 px-4 py-2 focus:outline-none">
							placeholder1
							<CloseIcon class="p-1" />
						</button>
					</div>
					<div class="col-span-5 flex justify-end mt-4">
						<BrandedButton :text="`Save changes`" />
					</div>
				</div>
			</div>
			<!-- Public view -->
			<div v-else>
				<!-- Avatar and description -->
				<div class="flex mb-6">
					<Avatar :avatar="avatar" :authorID="profile.id" :noClick="true" :size="`w-12 h-12`" />
					<p class="text-gray7 ml-4">
						Subscribe to {{ profile.name }}'s email notifications and manage existing subscriptions here
					</p>
				</div>
				<!-- Topics -->
				<div class="grid grid-cols-5 mb-3">
					<h6 class="col-span-1 font-semibold text-lg">Topics</h6>
					<div class="col-span-4 flex justify-between items-center">
						<p>Receive email notifications for all new posts</p>
						<label class="switch">
							<input type="checkbox" />
							<span class="slider round"></span>
						</label>
					</div>
				</div>
				<!-- Show list of available tags to subscribe to -->
				<div class="grid grid-cols-5 mb-2">
					<span class="col-span-1"></span>
					<p class="col-span-4">Receive notifications based on tag:</p>
				</div>
				<div class="grid grid-cols-5 mb-6">
					<span class="col-span-1"></span>
					<div class="flex flex-row flex-wrap col-span-4">
						<TagCard :tag="`placeholder1`" :noClick="true" class="mr-2 mb-2" />
						<TagCard :tag="`placeholder2`" :noClick="true" class="mr-2 mb-2" />
						<TagCard :tag="`placeholder3`" :noClick="true" class="mr-2 mb-2" />
					</div>
				</div>
				<!-- Select email -->
				<div class="grid grid-cols-5 mb-6">
					<h6 class="col-span-1 font-semibold text-lg">Destination</h6>
					<div class="col-span-4 flex flex-col">
						<!-- For each active email -->
						<div v-if="$store.state.session.email" class="flex flex-row items-center">
							<input type="radio" checked />
							<p class="ml-2">{{ $store.state.session.email }}</p>
						</div>
					</div>
				</div>
				<!-- Submit or manage subscriptions -->
				<div class="flex justify-end items-center">
					<nuxt-link to="/settings/notifications" class="text-sm text-primary mr-4 flex flex-row items-center"
						><PlusIcon class="p-1 mr-1" />Manage all my notifications</nuxt-link
					>
					<BrandedButton :text="`Save changes`" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import CloseIcon from '@/components/icons/X.vue'
import Avatar from '@/components/Avatar.vue'
import TagCard from '@/components/Tag.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import PlusIcon from '@/components/icons/Plus.vue'

import { Profile } from '@/backend/profile'

export default Vue.extend({
	components: {
		CloseIcon,
		Avatar,
		TagCard,
		BrandedButton,
		PlusIcon,
	},
	props: {
		profile: {
			type: Object as PropType<Profile>,
			default: null,
		},
		avatar: {
			type: String as PropType<ArrayBuffer | string | null>,
			default: null,
		},
	},
	created() {
		window.addEventListener(`click`, this.handleClose, false)
	},
	methods: {
		handleClose(e: any): void {
			if (!e.target || e.target.firstChild === null || e.target.firstChild.classList === undefined) {
				return
			}
			if (e.target.firstChild.classList[0] === `popupCard`) {
				this.closePopup()
			}
		},
		closePopup() {
			this.$emit(`toggleNotificationsPopup`)
		},
	},
})
</script>

<style scoped>
/* The switch - the box around the slider */
.switch {
	position: relative;
	display: inline-block;
	width: 60px;
	height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
	opacity: 0;
	width: 0;
	height: 0;
}

/* The slider */
.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #dddddd;
	-webkit-transition: 0.4s;
	transition: 0.4s;
}

.slider:before {
	position: absolute;
	content: '';
	height: 26px;
	width: 26px;
	left: 4px;
	bottom: 4px;
	background-color: white;
	-webkit-transition: 0.4s;
	transition: 0.4s;
}

input:checked + .slider {
	background-color: #2e556a;
}

input:focus + .slider {
	box-shadow: 0 0 1px #2e556a;
}

input:checked + .slider:before {
	-webkit-transform: translateX(26px);
	-ms-transform: translateX(26px);
	transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
	border-radius: 34px;
}

.slider.round:before {
	border-radius: 50%;
}
</style>
