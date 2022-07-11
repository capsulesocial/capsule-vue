<template>
	<div
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50"
		style="backdrop-filter: blur(100px)"
	>
		<!-- Container -->
		<section>
			<div
				class="w-full lg:w-600 min-h-40 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation z-10 mr-5 overflow-y-auto rounded-lg p-6 pt-4 shadow-lg relative"
			>
				<div class="sticky flex items-center justify-between">
					<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-2xl font-semibold">
						This post has been hidden
					</h2>
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="$emit(`close`)">
						<CloseIcon />
					</button>
				</div>
				<div class="flex items-center">
					<div @mouseover="showInfoBubble = true" @mouseleave="showInfoBubble = false">
						<InfoIcon class="mr-4 h-8 w-8 text-gray5 dark:text-gray3" />
					</div>
					<p class="my-4 text-gray5 dark:text-gray3">
						Attention, you are viewing a post that has been
						<span
							class="text-negative cursor-default"
							@mouseover="showInfoBubble = true"
							@mouseleave="showInfoBubble = false"
							>hidden</span
						>.<br />
						Are you sure you want to view it?
					</p>
					<div
						v-show="showInfoBubble"
						class="border-lightBorder modal-animation absolute z-10 flex flex-col rounded-lg border bg-lightBG dark:bg-darkBG p-2 shadow-lg mx-4"
						:class="$colorMode.dark ? `dropdownInfoOpenDark` : `dropdownInfoOpen`"
						style="top: 120px; left: 0px"
					>
						<!-- Delete -->
						<span class="text-gray5 dark:text-gray3 self-center text-xs z-10"
							>After a post is published, you can remove it from your profile and make it undiscoverable, but, due to
							content permanence, you can't delete it entirely from Blogchain's network. This means that people who have
							the direct link to that post or its IPFS CID, might be able to access it forever.</span
						>
					</div>
				</div>
				<div class="flex justify-end items-center">
					<button class="text-primary focus:outline-none mr-6" @click="$emit(`close`)">View Post</button>
					<button
						class="focus:outline-none bg-primary text-lightButtonText transform rounded-lg px-12 py-2 font-bold shadow-lg transition duration-500 ease-in-out hover:scale-105"
						@click="goBack"
					>
						Go home
					</button>
				</div>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import InfoIcon from '@/components/icons/Info.vue'
import CloseIcon from '@/components/icons/X.vue'

interface IData {
	showInfoBubble: boolean
}

export default Vue.extend({
	components: { CloseIcon, InfoIcon },
	data(): IData {
		return {
			showInfoBubble: false,
		}
	},
	created() {
		window.addEventListener(`click`, this.handleCloseClick, false)
	},
	destroyed() {
		window.removeEventListener(`click`, this.handleCloseClick)
	},
	methods: {
		handleCloseClick(e: any): void {
			if (!e.target || e.target.parentNode === null || e.target.parentNode.classList === undefined) {
				return
			}
			if (e.target.classList[0] === `popup`) {
				this.$emit(`close`)
			}
		},
		goBack(): void {
			this.$router.push(`/home`)
		},
	},
})
</script>
<style>
.dropdownInfoOpen::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	left: 0.95rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
	z-index: 1;
}
.dropdownInfoOpenDark::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	left: 0.95rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #121212;
	border-radius: 2px;
	z-index: 1;
}
</style>
