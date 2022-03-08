<template>
	<main
		class="bg-img m-0 h-screen overflow-y-hidden p-0 bg-lightMainBG dark:bg-darkBG"
		:style="
			dark
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
							style="overflow-y: auto; overflow-x: hidden; backdrop-filter: blur(10px)"
							class="lg:w-7.5 min-h-61 h-61 xl:min-h-80 xl:h-80 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder modal-animation fixed z-10 rounded-t-lg border bg-gradient-to-r p-8 shadow-lg"
							@update="updateWordCount"
							@isWriting="hideDraftButton"
						/>
						<div
							id="draftButton"
							class="animatedraftButton from-lightBGStart to-lightBGStop dark:from-darkBG dark:to-darkBG border-lightBorder text-xs text-gray5 dark:text-gray3 modal-animation card-animation-delay1 absolute bottom-0 z-10 m-4 flex rounded-lg bg-gradient-to-r px-5 py-3 shadow-lg"
							style="backdrop-filter: blur(10px)"
						>
							<p v-if="!buttonHidden" class="mr-2">Resume writing?</p>
							<button
								v-if="!buttonHidden"
								class="text-primary dark:text-secondary focus:outline-none"
								@click="openDraftsPopup"
							>
								Show drafts
							</button>
							<button v-else class="text-primary dark:text-secondary focus:outline-none" @click="openDraftsPopup">
								<PencilIcon class="fill-current p-1" />
							</button>
						</div>
						<!-- Widgets -->
						<aside
							class="modal-animation w-5/12 -mr-5 -mt-4 overflow-y-auto p-4"
							style="min-height: calc(100vh - 70px); height: calc(100vh - 70px)"
						>
							<EditorWidgets :wordCount="wordCount" @confirm="toggleConfirmPost" />
							<Footer />
						</aside>
					</section>
				</div>
			</div>
		</div>
		<DraftsPopup v-if="showDrafts" @close="closeDraftsPopup" />
		<ConfirmPopup v-if="showConfirm" @close="showConfirmPopup" @post="handlePost" />
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import ogImage from '@/assets/images/util/ogImage.png'

import EditorWidgets from '@/components/widgets/Editor.vue'
import PostEditor from '@/components/post/Editor.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import PencilIcon from '@/components/icons/Pencil.vue'
import DraftsPopup from '@/components/popups/DraftsPopup.vue'
import ConfirmPopup from '@/components/popups/ConfirmPopup.vue'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'
import { IBackground, backgrounds } from '@/config'

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
	wordCount: number
	showDrafts: boolean
	showConfirm: boolean
	buttonHidden: boolean
	bgImage: IBackground
	dark: boolean
}

export default Vue.extend({
	components: {
		EditorWidgets,
		PostEditor,
		Header,
		Footer,
		DraftsPopup,
		ConfirmPopup,
		PencilIcon,
	},
	data(): IData {
		return {
			profile: null,
			avatar: null,
			wordCount: 0,
			showDrafts: false,
			showConfirm: false,
			buttonHidden: false,
			bgImage: backgrounds[0],
			dark: false,
		}
	},
	head() {
		return {
			title: `Write a post - Blogchain`,
			meta: [
				{ hid: `editor`, name: `editor`, content: `Write a post on Blogchain` },
				{ hid: `og:image`, property: `og:image`, content: `${document.location.origin}` + ogImage },
			],
		}
	},
	async created() {
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			this.$router.push(`/home`)
		}
		// Set color mode
		this.$setColorMode(this.$store.state.settings.darkMode)
		// get logged in profile
		const { profile } = await getProfile(this.$store.state.session.id)
		this.profile = profile
		// Get avatar
		if (this.profile && this.profile.avatar.length > 1) {
			getPhotoFromIPFS(this.profile.avatar).then((p) => {
				this.avatar = p
			})
		}
		this.bgImage = this.$getBGImage(this.profile?.background, `local`)
		// Check if the active draft exists
		if (this.$store.state.draft.drafts[this.$store.state.draft.activeIndex] === undefined) {
			this.$store.commit(`draft/setActiveDraft`, 0)
		}
		if (document.documentElement.classList.contains(`dark`)) {
			this.dark = true
		} else {
			this.dark = false
		}
	},
	methods: {
		toggleConfirmPost() {
			this.showConfirm = true
		},
		async handlePost() {
			// @ts-ignore
			await this.$refs.editor.post()
		},
		updateWordCount(num: number) {
			this.wordCount = num
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
				// @ts-ignore
				this.$refs.editor.setupEditor()
			})
		},
		openDraftsPopup(): void {
			// @ts-ignore
			this.$refs.editor.updateContent()
			this.showDrafts = true
		},
		showConfirmPopup(): void {
			this.showConfirm = !this.showConfirm
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
