<template>
	<div
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
	>
		<div
			class="popup min-h-40 w-full lg:w-600 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg bg-gradient-to-r px-6 pt-4 pb-6 shadow-lg"
			style="backdrop-filter: blur(10px)"
		>
			<!-- Header and close icon -->
			<div class="flex items-center justify-between pb-4">
				<h4 class="text-xl font-semibold dark:text-darkPrimaryText">Configure newsletter</h4>
				<button
					class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1"
					@click="$emit(`toggleNewsletterPopup`)"
				>
					<CloseIcon />
				</button>
			</div>
			<!-- Self-view view -->
			<div v-if="$store.state.session.id === $route.params.id">
				<p class="text-gray5 dark:text-gray3 mb-4">
					Display highlighted tags on your profile for readers to enable email newsletter to receive your posts in their
					inbox. You can highlight up to three different tags:
				</p>
				<div class="flex flex-row justify-between mb-3 mt-8">
					<!-- Add tag input -->
					<label
						for="tagInput"
						class="font-semibold col-span-1 mr-20 mt-2 text-lightPrimaryText dark:text-darkPrimaryText"
						>Topics</label
					>
					<div class="flex flex-col w-full">
						<input
							id="tagInput"
							:ref="tagInput"
							type="text"
							placeholder="Add three topics to your profile..."
							class="w-full rounded-lg px-4 py-2 bg-gray1 dark:bg-gray7 dark:text-darkPrimaryText placeholder-gray5 dark:placeholder-gray3 focus:outline-none"
						/>
						<div class="flex flex-row flex-wrap mt-2">
							<button
								v-for="tag in 3"
								:key="tag.id"
								class="focus:outline-none bg-gray1 dark:bg-gray7 z-10 mr-4 mt-2 flex flex-row items-center rounded-lg px-3 py-1"
							>
								<span class="text-gray5 dark:text-gray1 text-lg"><p class="text-sm">Elon Musk</p></span
								><CloseIcon class="text-gray5 dark:text-gray1 p-1 pr-0" />
							</button>
						</div>
					</div>
				</div>
				<div class="flex flex-row-reverse mt-8">
					<!-- If no tags, button must be opacity-50 and deactivated -->
					<button
						:class="true ? `` : `opacity-50 cursor-not-allowed`"
						class="bg-darkBG text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:bg-opacity-75"
						style="padding: 0.4rem 1.5rem"
						:disabled="false"
						@click="saveNewsletterTags"
					>
						<span class="font-sans" style="font-size: 0.95rem"> Save </span>
					</button>
				</div>
			</div>
			<!-- Public view -->
			<div v-else>
				<!-- Avatar and description -->
				<div class="flex mb-6 items-center">
					<Avatar :avatar="avatar" :authorID="profile.id" :noClick="true" :size="`w-12 h-12`" />
					<p v-if="profile.name !== ``" class="text-lightPrimaryText dark:text-darkPrimaryText ml-4 w-10/12">
						Create your personalised email newsletter from {{ profile.name }}'s posts and manage it here:
					</p>
					<p v-else class="text-lightPrimaryText dark:text-darkPrimaryText ml-4 w-10/12">
						Create your personalised email newsletter from @{{ profile.id }}'s posts and manage it here:
					</p>
				</div>
				<!-- Topics -->
				<div class="flex flex-row justify-between mb-3 mt-8">
					<label for="tagInput" class="font-semibold mr-20 text-lightPrimaryText dark:text-darkPrimaryText"
						>Topics</label
					>
					<div class="flex flex-col w-full">
						<div class="flex justify-between items-center">
							<p class="text-gray5 dark:text-gray3 w-4/5">Receive email newsletter for all new posts</p>
							<BasicSwitch :enabled="this.allPosts" @toggle="toggleAllPosts" />
						</div>
						<p class="mt-6 mb-3 text-gray5 dark:text-gray3">Or receive email newsletter based on topics:</p>
						<div class="flex flex-row flex-wrap text-lg">
							<div v-for="tag in 3" :key="tag._id">
								<button
									class="flex flex-row items-center justify-between px-3.5 py-1.5 my-2 mr-4 border shadow-sm rounded-lg bg-gray1 dark:bg-gray7 transition duration-500 ease-in-out"
									:class="true ? `border-primary` : `border-lightBorder dark:border-darkBorder`"
									@click="selectTag(tag)"
								>
									<span class="text-gray5 dark:text-gray1 text-sm"> Elon Musk </span>
								</button>
							</div>
						</div>
					</div>
				</div>
				<!-- frequency -->
				<div class="flex flex-row mb-3 mt-8">
					<label for="tagInput" class="font-semibold mr-11 mt-4 text-lightPrimaryText dark:text-darkPrimaryText"
						>Frequency</label
					>
					<div class="flex flex-row flex-wrap text-lg">
						<div v-for="period in 4" :key="period._id">
							<button
								class="flex flex-row items-center justify-between px-4 py-3 my-2 mr-4 border shadow-sm rounded-lg from-lightBGStart to-lightBGStop dark:from-darkBG dark:to-darkBG bg-gradient-to-r transition duration-500 ease-in-out"
								:class="true ? `border-primary` : `border-lightBorder dark:border-darkBorder`"
								@click="selectPeriod(period)"
							>
								<CheckCircleIcon
									:isChecked="true"
									class="text-primary w-5 h-5 mr-2 flex items-center transition duration-500 ease-in-out"
								/>
								<span class="text-lightPrimaryText dark:text-darkPrimaryText text-sm"> Monthly </span>
							</button>
						</div>
					</div>
				</div>
				<!-- email Destination -->
				<div class="flex flex-row justify-between mb-3 mt-10">
					<label for="tagInput" class="font-semibold mr-9 text-lightPrimaryText dark:text-darkPrimaryText"
						>Destination</label
					>
					<div class="flex flex-col w-full">
						<div class="col-span-4 flex flex-col">
							<!-- For each active email -->
							<div v-if="$store.state.session.email" class="flex flex-row items-center">
								<label class="checkboxcontainer">
									<input type="checkbox" checked="checked" />
									<span class="checkmark"></span>
								</label>
								<p class="ml-2 text-lightPrimaryText dark:text-darkPrimaryText">{{ $store.state.session.email }}</p>
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
				<!-- Submit or manage email newsletter -->
				<div class="flex justify-end items-center mt-10">
					<nuxt-link to="/settings/notifications" class="text-sm text-primary mr-6 flex flex-row items-center"
						>Manage all my newsletter</nuxt-link
					>
					<!-- If no email or no topics selected, button must be opacity-50 and deactivated -->
					<button
						:class="true ? `` : `opacity-50 cursor-not-allowed`"
						class="bg-darkBG text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:bg-opacity-75"
						style="padding: 0.4rem 1.5rem"
						:disabled="false"
						@click="createNewsletter"
					>
						<span class="font-sans" style="font-size: 0.95rem"> Create newsletter </span>
					</button>
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
import BasicSwitch from '@/components/BasicSwitch.vue'
import CheckCircleIcon from '@/components/icons/CheckCircle.vue'
import PlusIcon from '@/components/icons/Plus.vue'
import { Profile } from '@/backend/profile'

interface IData {
	allPosts: boolean
}

export default Vue.extend({
	components: {
		CloseIcon,
		Avatar,
		PlusIcon,
		BasicSwitch,
		CheckCircleIcon,
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
	data(): IData {
		return {
			allPosts: true,
		}
	},
	created() {},
	mounted() {
		window.addEventListener(`click`, this.handleClose, false)
	},
	methods: {
		handleClose(e: any): void {
			if (!e.target || e.target.parentNode === null || e.target.firstChild?.classList === undefined) {
				return
			}
			if (e.target.firstChild.classList[0] === `popup`) {
				this.closePopup()
			}
		},
		closePopup() {
			this.$emit(`toggleNewsletterPopup`)
		},
		toggleAllPosts() {
			this.allPosts = !this.allPosts
		},
		toggleAddEmailPopup() {},
		selectTag(tag: any) {
			return tag
		},
		selectPeriod(period: any) {
			return period
		},
		saveNewsletterTags() {},
		createNewsletter() {
			this.closePopup()
		},
	},
})
</script>
<style scoped>
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
	background-color: #121212;
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
</style>