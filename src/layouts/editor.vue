<template>
	<main class="h-screen p-0 m-0 bg-img" :style="{ backgroundImage: `url(` + $store.state.backgroundImage + `)` }">
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
					<section class="flex flex-row">
						<PostEditor
							ref="editor"
							style="
								width: 750px;
								min-height: calc(100vh - 88px);
								height: calc(100vh - 88px);
								backdrop-filter: blur(10px);
							"
							class="fixed overflow-y-auto rounded-t-lg shadow-lg mr-5 p-8 z-10 bg-gradient-to-r from-lightBGStart to-lightBGStop border-lightBorder modal-animation card-animation"
							@update="updateWordCount"
						/>
						<div
							class="fixed bottom-0 z-10 m-4 px-5 py-3 bg-gradient-to-r from-lightBGStart to-lightBGStop border-lightBorder rounded-lg shadow-lg test-xs text-gray5 modal-animation card-animation-delay1"
						>
							Resume writing? <button class="text-primary ml-2" @click="showDraftsPopup">Show drafts</button>
						</div>
						<!-- Widgets -->
						<aside
							class="fixed overflow-y-auto p-4 -mt-4 modal-animation card-animation-delay1"
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
import DraftsPopup from '@/components/widgets/DraftsPopup.vue'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
	wordCount: number
	showDrafts: boolean
}

export default Vue.extend({
	components: {
		EditorWidgets,
		PostEditor,
		Header,
		Footer,
		DraftsPopup,
	},
	data(): IData {
		return {
			profile: null,
			avatar: null,
			wordCount: 0,
			showDrafts: false,
		}
	},
	async created() {
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			this.$router.push(`/`)
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
		showDraftsPopup(): void {
			// @ts-ignore
			this.$refs.editor.saveContent()
			this.showDrafts = !this.showDrafts
		},
	},
})
</script>

<style>
.bg-img {
	background-attachment: fixed;
	background-size: cover;
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
