<template>
	<div
		class="bg-primary modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50"
	>
		<div
			class="popupCard from-lightBGStart to-lightBGStop card-animation overflow-y-auto rounded-lg bg-gradient-to-r p-6 pt-4 shadow-lg backdrop-blur-lg backdrop-filter"
			style="max-height: 90%; width: 650px; backdrop-filter: blur(10px)"
		>
			<!-- Header and close icon -->
			<div class="flex items-center justify-between pb-6">
				<h2 class="text-primary text-xl font-semibold">Configure Notifications</h2>
				<button class="bg-gray1 focus:outline-none rounded-full p-1" @click="closePopup"><CloseIcon /></button>
			</div>
			<!-- Self-view view -->
			<div v-if="$store.state.session.id === $route.params.id">
				<p class="text-gray7 mb-4">
					Display highlighted tags on your profile for readers to enable email notifications to receive your posts. You
					can display up to three different tags:
				</p>
				<div class="flex flex-row justify-between mb-3 mt-8">
					<!-- Add tag input -->
					<label for="tagInput" class="font-semibold col-span-1 mr-20 mt-2">Topics</label>
					<div class="flex flex-col w-full">
						<div class="bg-gray1 rounded-lg px-4 py-2">
							<input
								id="tagInput"
								:ref="tagInput"
								type="text"
								placeholder="Add three topics to your profile..."
								class="w-full text-gray7 bg-gray1 focus:outline-none"
							/>
						</div>
						<div class="flex flex-row flex-wrap mt-2">
							<button
								class="focus:outline-none bg-gray1 z-10 mr-4 mt-2 flex flex-row items-center rounded-lg px-3 py-1"
							>
								<span class="text-gray5 text-lg"><p class="text-sm">Elon Musk</p></span
								><CloseIcon class="text-gray5 p-1 pr-0" />
							</button>
							<button
								class="focus:outline-none bg-gray1 z-10 mr-4 mt-2 flex flex-row items-center rounded-lg px-3 py-1"
							>
								<span class="text-gray5 text-lg"><p class="text-sm">Internet</p></span
								><CloseIcon class="text-gray5 p-1 pr-0" />
							</button>
							<button
								class="focus:outline-none bg-gray1 z-10 mr-4 mt-2 flex flex-row items-center rounded-lg px-3 py-1"
							>
								<span class="text-gray5 text-lg"><p class="text-sm">Web3</p></span
								><CloseIcon class="text-gray5 p-1 pr-0" />
							</button>
						</div>
					</div>
				</div>
				<div class="flex justify-end mt-8">
					<BrandedButton :text="`Save changes`" />
				</div>
			</div>
			<!-- Public view -->
			<div v-else>
				<!-- Avatar and description -->
				<div class="flex mb-6">
					<Avatar :avatar="avatar" :authorID="profile.id" :noClick="true" :size="`w-12 h-12`" />
					<p class="text-gray7 ml-4 w-10/12">
						Subscribe to {{ profile.name }}'s email notifications and manage them here
					</p>
				</div>
				<!-- Topics -->
				<div class="flex flex-row justify-between mb-3 mt-8">
					<!-- Add tag input -->
					<label for="tagInput" class="font-semibold mr-20 mt-1">Topics</label>
					<div class="flex flex-col w-full">
						<div class="flex justify-between items-center">
							<p>Receive email notifications for all new posts</p>
							<label class="switch">
								<input type="checkbox" />
								<span class="slider round"></span>
							</label>
						</div>
						<p class="mt-6 mb-3">Or receive notifications based on topics:</p>
						<div class="flex flex-row flex-wrap text-lg">
							<TagCard :tag="`placeholder1`" :noClick="true" class="mr-2" />
							<TagCard :tag="`placeholder2`" :noClick="true" class="mr-2" />
							<TagCard :tag="`placeholder3`" :noClick="true" class="mr-2" />
						</div>
					</div>
				</div>
				<div class="flex flex-row justify-between mb-3 mt-14">
					<!-- Add tag input -->
					<label for="tagInput" class="font-semibold mr-9">Destination</label>
					<div class="flex flex-col w-full">
						<div class="col-span-4 flex flex-col">
							<!-- For each active email -->
							<div v-if="$store.state.session.email" class="flex flex-row items-center">
								<label class="checkboxcontainer">
									<input type="checkbox" checked="checked" />
									<span class="checkmark"></span>
								</label>
								<p class="ml-2">{{ $store.state.session.email }}</p>
							</div>
							<button
								class="flex items-center text-primary text-sm focus:outline-none mt-3"
								@click="toggleAddEmailPopup"
							>
								<PlusIcon class="p-1 mr-1" />
								Add an email address
							</button>
						</div>
					</div>
				</div>
				<!-- Submit or manage email notifications -->
				<div class="flex justify-end items-center mt-10">
					<nuxt-link to="/settings/notifications" class="text-sm text-primary mr-6 flex flex-row items-center"
						>Manage all my notifications</nuxt-link
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
	width: 50px;
	height: 29px;
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
	height: 23px;
	width: 23px;
	left: 3px;
	bottom: 3px;
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
	-webkit-transform: translateX(21px);
	-ms-transform: translateX(21px);
	transform: translateX(21px);
}

/* Rounded sliders */
.slider.round {
	border-radius: 34px;
}

.slider.round:before {
	border-radius: 50%;
}

/* The container */
.checkboxcontainer {
	display: block;
	position: relative;
	padding-left: 30px;
	height: 80%;
	cursor: pointer;
	font-size: 22px;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

/* Hide the browser's default checkbox */
.checkboxcontainer input {
	position: absolute;
	opacity: 0;
	cursor: pointer;
	height: 0;
	width: 0;
}

/* Create a custom checkbox */
.checkmark {
	position: absolute;
	top: 0;
	left: 0;
	height: 20px;
	width: 20px;
	background-color: #dddddd;
	border-radius: 5px;
	-webkit-transition: 0.4s;
	transition: 0.4s;
}

/* On mouse-over, add a grey background color */
.checkboxcontainer:hover input ~ .checkmark {
	background-color: #bbbbbb;
}

/* When the checkbox is checked, add a blue background */
.checkboxcontainer input:checked ~ .checkmark {
	background-color: #2e556a;
	border-radius: 5px;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
	content: '';
	position: absolute;
	display: none;
}

/* Show the checkmark when checked */
.checkboxcontainer input:checked ~ .checkmark:after {
	display: block;
}

/* Style the checkmark/indicator */
.checkboxcontainer .checkmark:after {
	left: 9px;
	top: -1px;
	width: 7px;
	height: 17px;
	border: solid white;
	border-width: 0 2px 2px 0;
	-webkit-transform: rotate(45deg);
	-ms-transform: rotate(45deg);
	transform: rotate(45deg);
}
</style>
