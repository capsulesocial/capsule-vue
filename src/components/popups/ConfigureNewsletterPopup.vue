<template>
	<div
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
	>
		<div
			class="popup w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg px-6 pt-4 pb-6 shadow-lg"
		>
			<!-- Header and close icon -->
			<div class="flex items-center justify-between pb-4">
				<h4 class="text-xl font-semibold dark:text-darkPrimaryText">Configure email notification</h4>
				<button
					class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1"
					@click="$emit(`toggleNewsletterPopup`)"
				>
					<CloseIcon />
				</button>
			</div>
			<div>
				<!-- Avatar and description -->
				<div class="flex mb-6 items-center">
					<Avatar :avatar="avatar" :authorID="profile.id" :noClick="true" :size="`w-12 h-12`" />
					<p v-if="profile.name !== ``" class="text-lightPrimaryText dark:text-darkPrimaryText ml-4 w-10/12">
						Manage all your email notifications from {{ profile.name }} here:
					</p>
					<p v-else class="text-lightPrimaryText dark:text-darkPrimaryText ml-4 w-10/12">
						Manage all your email notifications from @{{ profile.id }} here:
					</p>
				</div>
				<!-- List of newsletters for this author -->
				<NewsletterPreview
					v-for="n in newsletters"
					:key="n.email"
					:newsletter="n"
					@subscriptionDeleted="fetchNewsletters"
				/>
				<!-- Submit or manage email newsletter -->
				<div class="flex justify-end items-center mt-10">
					<button
						class="bg-darkBG text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:bg-opacity-75"
						style="padding: 0.4rem 1.5rem"
						@click="createNewsletter"
					>
						<span class="font-sans" style="font-size: 0.95rem"> Save </span>
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
import { Profile } from '@/backend/profile'
import { listForAuthor } from '@/backend/emails'

interface IData {
	newsletters: Array<Object>
}

export default Vue.extend({
	components: {
		CloseIcon,
		Avatar,
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
			newsletters: [],
		}
	},
	created() {},
	mounted() {
		window.addEventListener(`click`, this.handleClose, false)
		this.fetchNewsletters()
	},
	destroyed() {
		window.removeEventListener(`click`, this.handleClose, false)
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
		async fetchNewsletters() {
			try {
				this.newsletters = await listForAuthor(this.profile.id, this.$store.state.session.id)
			} catch (err) {
				this.$handleError(err)
			}
		},
		closePopup() {
			this.$emit(`toggleNewsletterPopup`)
		},
		createNewsletter() {
			this.closePopup()
		},
	},
})
</script>