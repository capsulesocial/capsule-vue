<template>
	<main
		class="bg-img m-0 h-screen p-0"
		:style="{
			background:
				`linear-gradient(180deg, rgba(46, 85, 106, 0.02) 0%, rgba(46, 85, 106, 0) 50%), url(` +
				$store.state.backgroundImage +
				`)`,
			backgroundSize: `contain`,
		}"
	>
		<!-- Wrapper -->
		<div class="flex w-full justify-center">
			<div class="flex flex-col" style="width: 1220px">
				<!-- Header -->
				<Header :avatar="avatar" />
				<!-- Body -->
				<div>
					<!-- Content -->
					<section class="relative flex flex-row overflow-x-hidden">
						<PostEditor
							ref="editor"
							style="
								width: 750px;
								min-height: calc(100vh - 88px);
								height: calc(100vh - 88px);
								backdrop-filter: blur(10px);
							"
							class="from-lightBGStart to-lightBGStop border-lightBorder modal-animation fixed z-10 mr-5 overflow-y-auto rounded-t-lg border bg-gradient-to-r p-8 shadow-lg"
							@update="updateWordCount"
							@isWriting="hideDraftButton"
						/>
						<div
							id="draftButton"
							class="animatedraftButton from-lightBGStart to-lightBGStop border-lightBorder test-xs text-gray5 modal-animation card-animation-delay1 absolute bottom-0 z-10 m-4 flex rounded-lg bg-gradient-to-r px-5 py-3 shadow-lg"
							style="backdrop-filter: blur(10px)"
						>
							Resume writing?
							<button v-if="!buttonHidden" class="text-primary focus:outline-none ml-2" @click="showDraftsPopup">
								Show drafts
							</button>
							<button v-else class="text-primary focus:outline-none ml-2" @click="showDraftsPopup">
								<PencilIcon class="fill-current p-1" />
							</button>
						</div>
						<!-- Widgets -->
						<aside
							class="modal-animation fixed -mt-4 overflow-y-auto p-4"
							style="margin-left: 755px; width: 485px; min-height: calc(100vh - 70px); height: calc(100vh - 70px)"
						>
							<EditorWidgets :wordCount="wordCount" @confirm="toggleConfirmPost" />
							<Footer />
						</aside>
					</section>
				</div>
			</div>
		</div>
		<div
			v-show="showDrafts"
			class="popup bg-primary modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50"
		>
			<DraftsPopup @close="showDraftsPopup" @updateEditor="updateEditor" />
		</div>
		<div
			v-if="showConfirm"
			class="popup bg-primary modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50"
		>
			<ConfirmPopup @close="showConfirmPopup" @post="handlePost" />
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import EditorWidgets from '@/components/widgets/Editor.vue'
import PostEditor from '@/components/post/Editor.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import PencilIcon from '@/components/icons/Pencil.vue'
import DraftsPopup from '@/components/widgets/DraftsPopup.vue'
import ConfirmPopup from '@/components/widgets/ConfirmPopup.vue'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
	wordCount: number
	showDrafts: boolean
	showConfirm: boolean
	buttonHidden: boolean
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
		}
	},
	async created() {
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			this.$router.push(`/home`)
		}
		// get logged in profile
		const { profile } = await getProfile(this.$store.state.session.id)
		this.profile = profile
		// Get avatar
		if (this.profile && this.profile.avatar.length > 1) {
			getPhotoFromIPFS(this.profile.avatar).then((p) => {
				this.avatar = p
			})
		}
		// Check if the active draft exists
		if (this.$store.state.draft.drafts[this.$store.state.draft.activeIndex] === undefined) {
			this.$store.commit(`draft/setActiveDraft`, 0)
		}
	},
	methods: {
		toggleConfirmPost() {
			this.showConfirm = true
		},
		updateEditor() {
			// @ts-ignore
			this.$refs.editor.updateContent()
			// @ts-ignore
			this.$refs.editor.setupEditor()
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
		showDraftsPopup(): void {
			if (!this.showDrafts) {
				// @ts-ignore
				this.$refs.editor.updateContent()
			} else {
				// @ts-ignore
				this.$refs.editor.setupEditor()
			}
			this.showDrafts = !this.showDrafts
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
	transform: translateX(-9.5rem);
	padding: 0.7rem;
}
/* Hide scrollbar for Chrome, Safari and Opera */
aside::-webkit-scrollbar {
	display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
aside {
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */
}
</style>
