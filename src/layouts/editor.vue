<template>
	<main
		class="bg-img m-0 h-screen overflow-y-hidden p-0 bg-lightBG dark:bg-darkBG"
		:style="
			$colorMode.dark
				? {
						backgroundImage: `url(` + bgImage.dark + `)`,
				  }
				: {
						backgroundImage: `url(` + bgImage.light + `)`,
				  }
		"
	>
		<!-- Wrapper -->
		<div class="flex w-full justify-center">
			<div class="flex w-full lg:w-11/12 xl:w-10/12 max-w-1220 flex-col">
				<!-- Header -->
				<Header :avatar="avatar" />
				<!-- Body -->
				<div>
					<!-- Content -->
					<section class="flex flex-row">
						<PostEditor
							ref="editor"
							style="overflow-y: auto; overflow-x: hidden"
							class="lg:w-7.5 min-h-61 h-61 xl:min-h-80 xl:h-80 bg-lightBG dark:bg-darkBGStop border-lightBorder modal-animation fixed z-10 rounded-t-lg border p-8 shadow-lg"
							@updateWordCount="updateWordCount"
							@isWriting="hideDraftButton"
						/>
						<div
							id="draftButton"
							class="animatedraftButton bg-lightBG dark:bg-darkBG border-lightBorder text-xs text-gray5 dark:text-gray3 modal-animation card-animation-delay1 absolute bottom-0 z-10 m-4 flex rounded-lg px-5 py-3 shadow-lg"
						>
							<p v-if="!buttonHidden" class="mr-2">Resume writing?</p>
							<button v-if="!buttonHidden" class="text-primary focus:outline-none" @click="openDraftsPopup">
								Show drafts
							</button>
							<button v-else class="text-primary focus:outline-none" @click="openDraftsPopup">
								<PencilIcon class="fill-current p-1" />
							</button>
						</div>
						<!-- Widgets -->
						<aside
							class="modal-animation w-5/12 -mr-5 -mt-4 overflow-y-auto p-4"
							style="min-height: calc(100vh - 70px); height: calc(100vh - 70px)"
						>
							<EditorWidgets
								:wordCount="wordCount"
								@openTierAccess="toggleShowTiers"
								@togglePreview="togglePreview"
								@confirm="checkPost"
							/>
							<Footer />
						</aside>
					</section>
				</div>
			</div>
		</div>
		<DraftsPopup v-if="showDrafts" @close="closeDraftsPopup" />
		<ConfirmPopup v-if="showConfirm" @close="showConfirmPopup" @post="sendPost" />
		<TierAccessPopup v-if="showTiers" @close="toggleShowTiers" />
		<PreviewPopup
			v-if="showPreview"
			:previewContent="previewContent"
			@close="togglePreview"
			@confirm="checkPostPreview"
		/>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import PencilIcon from '@/components/icons/Pencil.vue'
import DraftsPopup from '@/components/popups/DraftsPopup.vue'
import ConfirmPopup from '@/components/popups/ConfirmPopup.vue'
import TierAccessPopup from '@/components/popups/TierAccess.vue'
import PreviewPopup from '@/components/post/PreviewPopup.vue'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import { IBackground, backgrounds } from '@/config/backgrounds'

interface IData {
	profile: Profile | null
	avatar?: string | ArrayBuffer
	wordCount: number
	showDrafts: boolean
	showConfirm: boolean
	buttonHidden: boolean
	bgImage: IBackground
	showTiers: boolean
	showPreview: boolean
	previewContent: string | null
}

export default Vue.extend({
	components: {
		EditorWidgets: () => import(`@/components/widgets/Editor.vue`),
		PostEditor: () => import(`@/components/post/Editor.vue`),
		Header,
		Footer,
		DraftsPopup,
		ConfirmPopup,
		PencilIcon,
		TierAccessPopup,
		PreviewPopup,
	},
	middleware: `auth`,
	data(): IData {
		return {
			profile: null,
			wordCount: 0,
			showDrafts: false,
			showConfirm: false,
			buttonHidden: false,
			bgImage: backgrounds[0],
			avatar: undefined,
			showTiers: false,
			showPreview: false,
			previewContent: null,
		}
	},
	head() {
		return {
			title: `Write a post - Blogchain`,
			meta: [{ hid: `editor`, name: `editor`, content: `Write a post on Blogchain` }],
		}
	},
	async created() {
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			this.$router.push(`/home`)
		}
		// Set color mode
		this.$setColorMode(this.$store.state.settings.mode)
		this.$setColor(this.$store.state.settings.color)
		// get logged in profile
		const { profile } = await getProfile(this.$store.state.session.id)
		this.profile = profile
		// Get avatar
		if (this.profile && this.profile.avatar.length > 1) {
			getPhotoFromIPFS(this.profile.avatar).then((p) => {
				this.avatar = p
			})
		}
		this.bgImage = this.$getBGImage(this.profile?.background)
		// Check if the active draft exists
		if (this.$store.state.draft.drafts[this.$store.state.draft.activeIndex] === undefined) {
			this.$store.commit(`draft/setActiveDraft`, 0)
		}
		this.$store.dispatch(`subscriptionTiers/getTiers`, this.$store.state.session.id)
	},
	methods: {
		checkPost() {
			const validPost = this.$refs.editor.checkPost(true)
			if (validPost) {
				this.showConfirm = true
			}
		},
		sendPost() {
			this.$refs.editor.checkPost()
		},
		updateWordCount(num: number) {
			this.wordCount = num - 2
			this.$emit(`update`, this.wordCount)
		},
		hideDraftButton(value: boolean) {
			const draftButton = document.getElementById(`draftButton`)
			if (!draftButton) {
				return
			}
			if (value === true) {
				draftButton.classList.add(`hidedraftButton`)
				this.buttonHidden = true
			} else {
				draftButton.classList.remove(`hidedraftButton`)
				this.buttonHidden = false
			}
		},
		closeDraftsPopup(): void {
			this.showDrafts = false
			setTimeout(() => {
				this.$refs.editor.setupEditor()
			})
		},
		openDraftsPopup(): void {
			this.$refs.editor.updateContent()
			this.showDrafts = true
		},
		showConfirmPopup(): void {
			this.showConfirm = !this.showConfirm
		},
		toggleShowTiers() {
			this.showTiers = !this.showTiers
		},
		togglePreview() {
			const validPost = this.$refs.editor.checkPost(true)
			if (validPost) {
				this.previewContent = this.$refs.editor.getInputHTML()
				this.showPreview = !this.showPreview
			}
		},
		checkPostPreview() {
			this.showPreview = false
			this.checkPost()
		},
	},
})
</script>

<style>
.animatedraftButton {
	transition: all 0.4s;
}
.hidedraftButton {
	transform: translateX(-2rem);
	padding: 0.7rem;
}
</style>
