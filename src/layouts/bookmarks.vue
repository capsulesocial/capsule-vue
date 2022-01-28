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
					<!-- Title and peered nodes -->
					<div
						class="modal-animation fixed flex w-full items-center justify-between px-3 xl:px-0"
						style="width: 1220px; height: 62px"
					>
						<!-- Title -->
						<h1 class="text-primary text-3xl font-semibold xl:text-4xl">Bookmarks list</h1>
						<!-- Peered nodes -->
						<Nodes />
					</div>
					<!-- Content -->
					<section class="mt-16 flex flex-row xl:mt-20">
						<nuxt-child
							class="xl:w-750 min-h-120 h-120 xl:min-h-150 xl:h-150 from-lightBGStart to-lightBGStop border-lightBorder modal-animation fixed z-10 mr-5 w-full overflow-y-hidden rounded-lg border bg-gradient-to-r shadow-lg"
							:posts="posts"
							:isLoading="isLoading"
						/>
						<!-- Widgets -->
						<aside
							class="modal-animation fixed hidden xl:block"
							style="
								margin-left: 770px;
								width: 450px;
								min-height: calc(80vh - 160px);
								height: calc(80vh - 160px);
								backdrop-filter: blur(10px);
							"
						>
							<article
								class="from-lightBGStart to-lightBGStop border-lightBorder mb-5 h-full w-full overflow-y-scroll rounded-lg border bg-gradient-to-r px-6 py-4 shadow-lg"
							>
								<div class="flex flex-row items-center justify-between pb-4">
									<h6 class="text-primary text-base font-semibold">Filter by Category</h6>
									<button class="focus:outline-none text-primary pr-1 text-sm" @click="setFilter(``)">Clear</button>
								</div>
								<button
									v-for="c in categoryList"
									:key="c"
									class="focus:outline-none flex w-full items-center pb-2 capitalize"
									:to="`/bookmarks/` + c"
									@click="setFilter(c)"
								>
									<img :src="require(`@/assets/images/category/` + c + `/icon.webp`)" class="hotzone mr-1 h-8 w-8" />
									<span
										class="ml-2 border-b"
										:class="
											active === c ? 'border-primary text-primary' : ' text-lightPrimaryVariant border-transparent'
										"
									>
										{{ c }}</span
									>
								</button>
							</article>
							<Footer />
						</aside>
					</section>
				</div>
			</div>
		</div>
		<UnauthPopup />
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import Nodes from '@/components/Nodes.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import UnauthPopup from '@/components/popups/UnauthPopup.vue'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'
import { IPostResponse } from '@/backend/post'
import { categories } from '@/config'
import { getBookmarksOfUser } from '@/backend/bookmarks'

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
	posts: IPostResponse[]
	categoryList: string[]
	active: string
	isLoading: boolean
}

export default Vue.extend({
	components: {
		Nodes,
		Header,
		Footer,
		UnauthPopup,
	},
	data(): IData {
		return {
			profile: null,
			avatar: null,
			posts: [],
			categoryList: categories,
			active: ``,
			isLoading: true,
		}
	},
	async created() {
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			return
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
