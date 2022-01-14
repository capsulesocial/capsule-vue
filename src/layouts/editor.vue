<template>
	<main
		class="h-screen p-0 m-0 bg-img"
		:style="{
			background:
				`linear-gradient(180deg, rgba(46, 85, 106, 0.02) 0%, rgba(46, 85, 106, 0) 50%), url(` +
				$store.state.backgroundImage +
				`)`,
			backgroundSize: `contain`,
		}"
	>
		<!-- Wrapper -->
		<div class="w-full flex justify-center">
			<div class="flex flex-col" style="width: 1220px">
				<!-- Header -->
				<header class="w-full sticky top-0 py-5 bg-gradient-to-r z-10">
					<Header :avatar="avatar" />
				</header>
				<!-- Body -->
				<div>
					<!-- Content -->
					<section class="flex flex-row overflow-x-hidden relative">
						<PostEditor
							ref="editor"
							style="
								width: 750px;
								min-height: calc(100vh - 88px);
								height: calc(100vh - 88px);
								backdrop-filter: blur(10px);
							"
							class="fixed overflow-y-auto rounded-t-lg shadow-lg mr-5 p-8 z-10 bg-gradient-to-r from-lightBGStart to-lightBGStop border border-lightBorder modal-animation"
							@update="updateWordCount"
							@isWriting="hideDraftButton"
						/>
						<div
							id="draftButton"
							class="absolute bottom-0 z-10 m-4 px-5 py-3 animatedraftButton bg-gradient-to-r from-lightBGStart to-lightBGStop border-lightBorder rounded-lg shadow-lg test-xs text-gray5 modal-animation card-animation-delay1 flex"
							style="backdrop-filter: blur(10px)"
						>
							Resume writing?
							<button v-if="!buttonHidden" class="text-primary ml-2 focus:outline-none" @click="showDraftsPopup">
								Show drafts
							</button>
							<button v-else class="text-primary ml-2 focus:outline-none" @click="showDraftsPopup">
								<PencilIcon class="fill-current p-1" />
							</button>
						</div>
						<!-- Widgets -->
						<aside
							class="fixed overflow-y-auto p-4 -mt-4 modal-animation"
							style="margin-left: 755px; width: 485px; min-height: calc(100vh - 70px); height: calc(100vh - 70px)"
						>
							<EditorWidgets :wordCount="wordCount" @post="handlePost" />
							<Footer />
						</aside>
					</section>
				</div>
			</div>
		</div>
		<div
			v-if="showDrafts"
			class="popup fixed w-full h-screen bg-primary top-0 bottom-0 left-0 right-0 z-30 flex justify-center items-center bg-opacity-50 modal-animation"
		>
			<DraftsPopup @close="showDraftsPopup" />
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
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
	wordCount: number
	showDrafts: boolean
	buttonHidden: boolean
}

export default Vue.extend({
	components: {
		EditorWidgets,
		PostEditor,
		Header,
		Footer,
		DraftsPopup,
		PencilIcon,
	},
	data(): IData {
		return {
			profile: null,
			avatar: null,
			wordCount: 0,
			showDrafts: false,
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
			}
			this.showDrafts = !this.showDrafts
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
