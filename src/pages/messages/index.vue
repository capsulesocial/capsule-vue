<template>
	<div class="w-full text-lightPrimaryText bg-lightBG">
		<section class="flex h-screen flex-row pt-12">
			<article class="flex flex-shrink-0 flex-row p-4" style="width: 240px">
				<div class="-mr-4 flex h-full w-full flex-col py-4 pl-4 pr-4">
					<!-- Left Column: Messages list -->
					<div class="flex flex-row items-center">
						<span class="flex flex-row items-center">
							<h3 class="text-xl font-semibold">Messages</h3>
							<h6
								class="text-lightOnSecondaryText bg-lightSecondary ml-2 flex h-6 w-6 items-center justify-center rounded-full text-sm shadow-lg"
							>
								5
							</h6>
						</span>
						<div class="ml-auto">
							<button class="text-lightOnPrimaryText bg-lightPrimary flex items-center justify-center rounded-full p-2">
								<MailIcon />
							</button>
						</div>
					</div>
					<div class="mt-2">
						<div class="-mx-4 flex w-64 flex-col">
							<!-- Name & Contact card / button (active) -->
							<div
								class="text-lightPrimaryText bg-lightPrimary bg-opacity-25 relative my-2 flex flex-row items-center rounded-lg py-4 pl-2"
							>
								<div class="absolute right-0 top-0 mr-4 mt-4 text-xs">5 min</div>
								<img :src="friendAvatar" class="m-2 h-10 w-10 flex-shrink-0 rounded-lg" />
								<div class="ml-2 flex flex-grow flex-col">
									<div class="text-sm font-bold">Jack Dishman</div>
									<div class="w-40 truncate text-xs">
										Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, doloribus?
									</div>
								</div>
							</div>
							<!-- Contact Button (Inactive) -->
							<div
								class="text-lightOnSurfaceText bg-lightSurface relative my-2 flex flex-row items-center rounded-lg py-4 pl-2 shadow-lg"
							>
								<div class="absolute right-0 top-0 mr-4 mt-4 text-xs">1 day ago</div>
								<img :src="friendAvatar" class="m-2 h-10 w-10 flex-shrink-0 rounded-lg" />
								<div class="ml-2 flex flex-grow flex-col">
									<div class="text-sm font-bold">Jack Dishman</div>
									<div class="w-40 truncate text-xs">
										Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, doloribus?
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</article>
			<!-- Right column -->
			<article class="flex h-full w-full flex-col px-4 py-6" style="width: 660px">
				<!-- Header for selected chat -->
				<div class="flex p-4">
					<img :src="friendAvatar" class="h-10 w-10 rounded-lg" />
					<span class="pl-2">
						<h4 class="text-lg font-bold">Jack Dishman</h4>
						<h6 class="text-xs">Last seen today</h6>
					</span>
				</div>
				<div class="h-full overflow-hidden py-4">
					<div class="h-full overflow-y-auto">
						<!-- Response message -->
						<div class="flex items-end p-4">
							<img :src="friendAvatar" class="m-2 h-10 w-10 flex-shrink-0 rounded-lg" />
							<div class="bg-lightSecondary bg-opacity-25 shadow-lg my-2 ml-2 mr-12 rounded-lg px-2 pt-4">
								<p>Hey! Welcome to your messages inbox. Full functionality coming soon</p>
								<h6 class="p-4 text-right text-xs">10:00 AM</h6>
							</div>
						</div>

						<!-- Sent message -->
						<div class="flex flex-row-reverse items-end">
							<img :src="avatar" class="m-2 h-10 w-10 flex-shrink-0 rounded-lg" />
							<div class="bg-lightSurfaceVariant bg-opacity-25 my-2 mr-2 ml-12 rounded-lg px-2 pt-4">
								<p>Looking forward to it!</p>
								<h6 class="p-4 text-right text-xs">10:03 AM</h6>
							</div>
						</div>
					</div>
				</div>
				<!-- Start of comment bar -->
				<div class="flex flex-row items-center">
					<div
						class="text-lightPrimaryText bg-lightBG border-lightBorder flex h-10 w-full flex-row items-center rounded-xl border px-2"
					>
						<button class="ml-1 flex h-10 w-10 items-center justify-center">
							<AttachmentIcon />
						</button>
						<div class="w-full">
							<input
								type="text"
								class="text-lightPrimaryText placeholder-lightSecondaryText bg-lightBG border-lightBorder focus:outline-none flex h-10 w-full items-center border-t border-b text-sm"
								placeholder="Type your message...."
							/>
						</div>
						<div class="flex flex-row">
							<button class="ml-1 mr-2 flex h-10 w-8 items-center justify-center">
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
import { getPhotoFromIPFS } from '@/backend/photos'

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
		this.friendAvatar = await getPhotoFromIPFS(`QmNyc3T7RH6c7RtGFhdYjvRssqrN1SbNatsXmee3HZuZJ4`)
		if (this.$store.state.session.avatar) {
			this.avatar = await getPhotoFromIPFS(this.$store.state.session.avatar)
		}
	},
})
</script>
