<template>
	<main class="h-screen p-0 m-0 bg-img" :style="{ backgroundImage: `url(` + $store.state.backgroundImage + `)` }">
		<!-- Wrapper -->
		<div class="w-full flex justify-center">
			<div class="flex flex-col" style="width: 1220px">
				<!-- Header -->
				<header class="w-full sticky top-0 py-5 bg-gradient-to-r z-10 pb-4">
					<Header :avatar="avatar" />
				</header>
				<!-- Body -->
				<div>
					<!-- Title and peered nodes -->
					<div class="fixed w-full flex justify-between items-center" style="width: 1220px; height: 62px">
						<!-- Title -->
						<h1 class="font-semibold text-primary" style="font-size: 2.6rem">Bookmarks list</h1>
						<!-- Peered nodes -->
						<Nodes />
					</div>
					<!-- Content -->
					<section class="flex flex-row mt-20">
						<nuxt-child
							style="width: 750px; min-height: calc(100vh - 150px); height: calc(100vh - 150px)"
							class="fixed overflow-y-auto rounded-lg shadow-lg mr-5 z-10 bg-gradient-to-r from-lightBGStart to-lightBGStop border border-lightBorder"
							:posts="posts"
						/>
						<!-- Widgets -->
						<aside
							class="fixed"
							style="
								margin-left: 770px;
								width: 450px;
								min-height: calc(80vh - 160px);
								height: calc(80vh - 160px);
								backdrop-filter: blur(10px);
							"
						>
							<article
								class="w-full h-full overflow-y-scroll rounded-lg shadow-lg bg-gradient-to-r from-lightBGStart to-lightBGStop mb-5 px-6 py-4 border border-lightBorder"
							>
								<div class="flex flex-row justify-between pb-4 items-center">
									<h6 class="text-primary text-base font-semibold">Filter by Category</h6>
									<button class="focus:outline-none text-sm text-primary pr-1" @click="setFilter(``)">Show All</button>
								</div>
								<button
									v-for="c in categoryList"
									:key="c"
									class="w-full flex items-center pb-2 capitalize focus:outline-none"
									:to="`/bookmarks/` + c"
									@click="setFilter(c)"
								>
									<img :src="require(`@/assets/images/category/` + c + `/icon.webp`)" class="hotzone w-8 h-8 mr-1" />
									<span
										class="border-b ml-2"
										:class="
											active === c ? 'border-primary text-primary' : ' border-transparent text-lightPrimaryVariant'
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
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import Nodes from '@/components/Nodes.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'
import { IPostResponse, getPosts } from '@/backend/post'
import { categories } from '@/config'

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
	posts: IPostResponse[]
	categoryList: string[]
	active: string
}

export default Vue.extend({
	components: {
		Nodes,
		Header,
		Footer,
	},
	data(): IData {
		return {
			profile: null,
			avatar: null,
			posts: [],
			categoryList: categories,
			active: ``,
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
		this.fetchPosts()
	},
	methods: {
		setFilter(c: string) {
			this.fetchPosts(c)
			this.active = c
		},
		async fetchPosts(category: string | undefined = undefined) {
			this.posts = await getPosts(
				{ category, bookmarkedBy: this.$store.state.session.id },
				this.$store.state.session.id,
				{},
			)
		},
	},
})
</script>

<style>
.bg-img {
	background-attachment: fixed;
	background-size: cover;
}
</style>
