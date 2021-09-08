<template>
	<div
		class="w-full"
		:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText bg-lightBG' : 'text-darkPrimaryText bg-darkBG'"
	>
		<section class="flex flex-row h-screen pt-12">
			<article class="flex flex-row flex-shrink-0 p-4" style="width: 240px">
				<div class="flex flex-col w-full h-full pl-4 pr-4 py-4 -mr-4">
					<!-- Left Column: Messages list -->
					<div class="flex flex-row items-center">
						<span class="flex flex-row items-center">
							<h3 class="text-xl font-semibold">Messages</h3>
							<h6
								:class="
									this.$store.state.settings.darkMode
										? 'text-lightOnSecondaryText bg-lightSecondary'
										: 'text-darkOnSecondaryText bg-darkSecondary'
								"
								class="flex items-center justify-center h-6 w-6 ml-2 text-sm rounded-full shadow-lg"
							>
								5
							</h6>
						</span>
						<div class="ml-auto">
							<button
								:class="
									this.$store.state.settings.darkMode
										? 'text-lightOnPrimaryText bg-lightPrimary'
										: 'text-darkOnPrimaryText bg-darkPrimary'
								"
								class="flex items-center justify-center p-2 rounded-full"
							>
								<MailIcon />
							</button>
						</div>
					</div>
					<div class="mt-2">
						<div class="flex flex-col -mx-4 w-64">
							<!-- Name & Contact card / button (active) -->
							<div
								:class="
									this.$store.state.settings.darkMode
										? 'text-lightPrimaryText bg-lightPrimary bg-opacity-25'
										: 'text-darkPrimaryText bg-darkPrimary bg-opacity-75'
								"
								class="relative flex flex-row items-center py-4 pl-2 my-2 rounded-lg"
							>
								<div class="absolute text-xs right-0 top-0 mr-4 mt-4">5 min</div>
								<img :src="this.friendAvatar" class="w-10 h-10 rounded-lg flex-shrink-0 m-2" />
								<div class="flex flex-col flex-grow ml-2">
									<div class="text-sm font-bold">Jack Dishman</div>
									<div class="text-xs truncate w-40">
										Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, doloribus?
									</div>
								</div>
							</div>
							<!-- Contact Button (Inactive) -->
							<div
								:class="
									this.$store.state.settings.darkMode
										? 'text-lightOnSurfaceText bg-lightSurface'
										: 'text-darkOnSurfaceVariantText bg-darkSurface'
								"
								class="relative flex flex-row items-center py-4 pl-2 my-2 rounded-lg shadow-lg"
							>
								<div class="absolute text-xs right-0 top-0 mr-4 mt-4">1 day ago</div>
								<img :src="this.friendAvatar" class="w-10 h-10 rounded-lg flex-shrink-0 m-2" />
								<div class="flex flex-col flex-grow ml-2">
									<div class="text-sm font-bold">Jack Dishman</div>
									<div class="text-xs truncate w-40">
										Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, doloribus?
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</article>
			<!-- Right column -->
			<article class="flex flex-col h-full w-full px-4 py-6" style="width: 600px">
				<!-- Header for selected chat -->
				<div class="p-4 flex">
					<img :src="this.friendAvatar" class="w-10 h-10 rounded-lg" />
					<span class="pl-2">
						<h4 class="text-lg font-bold">Jack Dishman</h4>
						<h6 class="text-xs">Last seen today</h6>
					</span>
				</div>
				<div class="h-full overflow-hidden py-4">
					<div class="h-full overflow-y-auto">
						<!-- Response message -->
						<div class="flex items-end p-4">
							<img :src="this.friendAvatar" class="w-10 h-10 rounded-lg flex-shrink-0 m-2" />
							<div
								:class="
									this.$store.state.settings.darkMode
										? 'bg-lightSecondary shadow-lg bg-opacity-25'
										: 'bg-darkSecondary bg-opacity-75'
								"
								class="my-2 ml-2 mr-12 pt-4 px-2 rounded-lg"
							>
								<p>Hey! Welcome to your messages inbox. Full functionality coming soon</p>
								<h6 class="text-xs text-right p-4">10:00 AM</h6>
							</div>
						</div>

						<!-- Sent message -->
						<div class="flex flex-row-reverse items-end">
							<img :src="this.avatar" class="w-10 h-10 rounded-lg flex-shrink-0 m-2" />
							<div
								:class="
									this.$store.state.settings.darkMode
										? 'bg-lightSurfaceVariant bg-opacity-25'
										: 'text-darkOnSurfaceVariantText bg-darkSurface'
								"
								class="my-2 mr-2 ml-12 pt-4 px-2 rounded-lg"
							>
								<p>Looking forward to it!</p>
								<h6 class="text-xs text-right p-4">10:03 AM</h6>
							</div>
						</div>
					</div>
				</div>
				<!-- Start of comment bar -->
				<div class="flex flex-row items-center">
					<div
						:class="
							this.$store.state.settings.darkMode
								? 'text-lightPrimaryText bg-lightBG border-lightBorder'
								: 'text-darkPrimaryText bg-darkBG border-darkBorder'
						"
						class="flex flex-row items-center w-full border rounded-xl h-10 px-2"
					>
						<button class="flex items-center justify-center h-10 w-10 ml-1">
							<AttachmentIcon />
						</button>
						<div class="w-full">
							<input
								type="text"
								:class="
									this.$store.state.settings.darkMode
										? 'text-lightPrimaryText placeholder-lightSecondaryText bg-lightBG border-lightBorder'
										: 'text-darkPrimaryText placeholder-darkSecondaryText bg-darkBG border-darkBorder'
								"
								class="border-t border-b w-full focus:outline-none text-sm h-10 flex items-center"
								placeholder="Type your message...."
							/>
						</div>
						<div class="flex flex-row">
							<button class="flex items-center justify-center h-10 w-8 ml-1 mr-2">
								<SendIcon />
							</button>
						</div>
					</div>
				</div>
			</article>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import MailIcon from '@/components/icons/Mail.vue'
import AttachmentIcon from '@/components/icons/Attachment.vue'
import SendIcon from '@/components/icons/Send.vue'
import ipfs from '@/backend/ipfs'

interface IData {
	friendAvatar: string | null
	avatar: string | null
}

export default Vue.extend({
	components: {
		MailIcon,
		AttachmentIcon,
		SendIcon,
	},
	layout: `Messages`,
	data(): IData {
		return {
			friendAvatar: null,
			avatar: null,
		}
	},
	async created() {
		this.friendAvatar = await ipfs().getPhoto(`QmNyc3T7RH6c7RtGFhdYjvRssqrN1SbNatsXmee3HZuZJ4`)
		if (this.$store.state.session.avatar) {
			this.avatar = await ipfs().getPhoto(this.$store.state.session.avatar)
		}
	},
})
</script>
