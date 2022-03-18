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
			<div class="flex w-full lg:w-11/12 xl:w-10/12 flex-col max-w-1220">
				<!-- Header -->
				<Header :avatar="avatar" />
				<!-- Body -->
				<!-- Title and peered nodes -->
				<div
					class="modal-animation hidden lg:flex w-full items-center justify-between px-3 lg:px-0"
					style="height: 62px"
				>
					<!-- Title -->
					<h1 class="text-primary dark:text-secondary text-3xl font-semibold xl:text-4xl">Bookmarks list</h1>
					<!-- Peered nodes -->
					<Nodes />
				</div>
				<!-- Content -->
				<section class="flex flex-row lg:mt-2 xl:mt-5">
					<nuxt-child
						class="lg:w-7.5 min-h-61 h-61 xl:min-h-150 xl:h-150 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder modal-animation z-10 w-full overflow-y-hidden rounded-lg border bg-gradient-to-r shadow-lg"
						:posts="posts"
						:isLoading="isLoading"
					/>
					<!-- Widgets -->
					<aside
						class="w-5/12 -mr-5 -mt-4 p-4 modal-animation hidden lg:block"
						style="min-height: calc(80vh - 160px); height: calc(80vh - 160px); backdrop-filter: blur(10px)"
					>
						<article
							class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder mb-5 h-full w-full overflow-y-scroll rounded-lg border bg-gradient-to-r px-6 py-4 shadow-lg"
						>
							<div class="flex flex-row items-center justify-between pb-4">
								<h6 class="text-primary dark:text-secondary text-base font-semibold">Filter by Category</h6>
								<button class="focus:outline-none text-primary dark:text-secondary pr-1 text-sm" @click="setFilter(``)">
									Clear
								</button>
							</div>
							<button
								v-for="c in categoryList"
								:key="c"
								class="focus:outline-none flex w-full items-center pb-2 capitalize"
								:to="`/bookmarks/` + c"
								@click="setFilter(c)"
							>
								<img
									:src="
										dark
											? require(`@/assets/images/category/` + c + `/dark/icon.webp`)
											: require(`@/assets/images/category/` + c + `/light/icon.webp`)
									"
									class="hotzone mr-1 h-8 w-8"
								/>
								<span
									class="ml-2 border-b"
									:class="
										active === c
											? 'border-primary text-primary dark:border-secondary dark:text-secondary'
											: ' text-primary dark:text-gray3 border-transparent'
									"
								>
									{{ c.replace(`-`, ` `) }}</span
								>
							</button>
						</article>
						<Footer />
					</aside>
				</section>
			</div>
		</div>
		<UnauthPopup />
		<portal-target name="card-popup"></portal-target>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import Nodes from '@/components/Nodes.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import UnauthPopup from '@/components/popups/UnauthPopup.vue'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import { IPostResponse } from '@/backend/post'
import { categories, IBackground, backgrounds } from '@/config'
import { getBookmarksOfUser } from '@/backend/bookmarks'

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
	posts: IPostResponse[]
	categoryList: string[]
	active: string
	isLoading: boolean
	bgImage: IBackground
	dark: boolean
}

export default Vue.extend({
	components: {
		Nodes,
		Header,
		Footer,
		UnauthPopup,
	},
	middleware: `auth`,
	data(): IData {
		return {
			profile: null,
			avatar: null,
			posts: [],
			categoryList: categories,
			active: ``,
			isLoading: true,
			bgImage: backgrounds[0],
			dark: false,
		}
	},
	async created() {
		// Set color mode
		this.$setColorMode(this.$store.state.settings.darkMode)
		if (document.documentElement.classList.contains(`dark`)) {
			this.dark = true
		} else {
			this.dark = false
		}
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			this.isLoading = false
			return
		}
		// get logged in profile
		const { profile } = await getProfile(this.$store.state.session.id)
		this.profile = profile
		this.bgImage = this.$getBGImage(this.profile?.background, `local`)
		// Get avatar
		if (this.profile && this.profile.avatar.length > 1) {
			getPhotoFromIPFS(this.profile.avatar).then((p) => {
				this.avatar = p
			})
		}
		this.fetchPosts()
	},
	methods: {
		setFilter(c: string) {
			if (this.$store.state.session.id === ``) {
				return
			}
			this.fetchPosts(c)
			this.active = c
		},
		async fetchPosts(category?: string) {
			this.posts = await getBookmarksOfUser(this.$store.state.session.id, category)
			this.isLoading = false
		},
	},
})
</script>
