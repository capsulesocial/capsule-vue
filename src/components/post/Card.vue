<template>
	<article
		class="shadow rounded-lg my-2 p-5 w-full"
		:class="
			this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText border border-darkBorder'
		"
	>
		<!-- Post Preview Header: Avatar, name -->
		<div class="flex justify-between">
			<nuxt-link :to="'/' + this.post.authorID" class="flex items-center">
				<img v-if="this.avatar !== ``" :src="this.avatar" class="w-12 h-12 rounded-lg object-cover" />
				<ProfileIcon v-else class="w-12 h-12 border-2 rounded-full" />
				<div class="ml-4">
					<!-- Name, ID -->
					<div class="flex items-center">
						<h4
							:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
							class="text-bold mr-2 text-lg"
						>
							{{ this.authorName }}
						</h4>
						<h5
							:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
							class="mr-2"
						>
							@{{ this.post.authorID }}
						</h5>
					</div>
					<!-- Timestamp -->
					<h6
						:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
						class="text-xs mb-2"
					>
						{{ this.$formatDate(this.post.timestamp) }}
					</h6>
				</div>
			</nuxt-link>
			<button
				:class="
					this.$store.state.settings.darkMode
						? 'text-lightPrimaryText hover:text-lightActive '
						: 'text-darkPrimaryText hover:text-darkActive'
				"
				class="focus:outline-none self-start"
			>
				<XIcon />
			</button>
		</div>

		<!-- Preview Content -->
		<div class="my-2">
			<nuxt-link :to="'/post/' + this.post._id" class="flex justify-between">
				<div>
					<h3
						:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
						class="text-base font-bold capitalize"
					>
						{{ this.post.title }}
					</h3>
					<h4
						:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
						class="pt-2 text-sm"
					>
						{{ this.post.subtitle }}
					</h4>
				</div>
				<div class="ml-2">
					<img
						v-if="this.featuredPhoto !== ``"
						:src="this.featuredPhoto"
						class="w-32 h-24 rounded object-cover object-top"
					/>
				</div>
			</nuxt-link>
		</div>

		<!-- Actions -->
		<div class="pt-2 flex justify-between">
			<div class="flex">
				<button
					class="flex focus:outline-none self-center mr-2"
					:class="this.getStyles()"
					@click="showComments = !showComments"
				>
					<CommentIcon class="fill-primary" />
				</button>
				<Share
					:post="this.post"
					:class="this.$store.state.settings.darkMode ? 'fill-lightActive' : 'fill-darkActive'"
					class="fill-primary self-center z-20"
				/>
				<BookmarkButton
					:postID="this.post.cid"
					:class="this.$store.state.settings.darkMode ? 'fill-lightActive' : 'fill-darkActive'"
					class="self-center"
				/>
			</div>

			<div v-show="this.showComments" class="flex relative">
				<!-- Comment filter -->
				<button class="text-primary font-bold">Statistics</button>
				<span class="px-2">|</span>
				<h6>Sort by:</h6>
				<button
					class="toggle focus:outline-none flex justify-between items-center border rounded-lg px-4 ml-4 text-sm w-32"
					@click.stop="showFilter = !showFilter"
				>
					<span v-if="this.filter === null" class="toggle font-bold">All</span>
					<span v-else class="toggle capitalize font-bold">{{ this.filter }}</span>
					<ChevronUp v-if="this.showFilter" />
					<ChevronDown v-else />
				</button>
				<!-- comment filter dropdown -->
				<div v-show="this.showFilter" class="absolute hotzone mt-8 z-10 bg-white rounded-lg shadow-lg p-4 w-full">
					<!-- Select charge of reaction button -->
					<div class="hotzone flex justify-between mb-2">
						<button
							class="focus:outline-none border-b-4"
							:class="this.feeling === `positive` ? `border-green-500` : `border-transparent`"
							@click="setCommentFilterFeeling(`positive`)"
						>
							Positive
						</button>
						<button
							class="focus:outline-none border-b-4"
							:class="this.feeling === `neutral` ? `border-yellow-500` : `border-transparent`"
							@click="setCommentFilterFeeling(`neutral`)"
						>
							Neutral
						</button>
						<button
							class="focus:outline-none border-b-4"
							:class="this.feeling === `negative` ? ` border-red-500` : `border-transparent`"
							@click="setCommentFilterFeeling(`negative`)"
						>
							Negative
						</button>
					</div>
					<!-- Show faces -->
					<div class="grid grid-cols-3 h-64 gap-1 overflow-y-auto">
						<button v-for="r in this.$store.state.config.feelings[this.feeling]" :key="r.label">
							<img
								:src="$store.state.config.reactions[r].image"
								:alt="$store.state.config.reactions[r].label"
								class="flex-shrink-0 h-20 w-20"
								@click="setCommentFilter($store.state.config.reactions[r].label)"
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
		<PostActions v-show="this.showComments" :post="this.post" :filter="this.filter" />
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import PostActions from '@/components/post/Actions.vue'
import XIcon from '@/components/icons/X.vue'
import ProfileIcon from '@/components/icons/Person.vue'
import BookmarkButton from '@/components/post/BookmarkButton.vue'
import Share from '@/components/post/Share.vue'
import CommentIcon from '@/components/icons/Comment.vue'
import ChevronUp from '@/components/icons/ChevronUp.vue'
import ChevronDown from '@/components/icons/ChevronDown.vue'

export default Vue.extend({
	name: `PostCard`,
	components: {
		PostActions,
		XIcon,
		ProfileIcon,
		BookmarkButton,
		Share,
		CommentIcon,
		ChevronUp,
		ChevronDown,
	},
	props: {
		post: {
			type: Object,
			default: null,
		},
	},
	data() {
		return {
			showComments: false,
			showFilter: false,
			filter: null,
			authorName: ``,
			authorID: ``,
			authorCID: ``,
			avatar: ``,
			featuredPhoto: ``,
			feeling: `positive`,
		}
	},
	created() {
		if (this.$store.state.session.cid === this.$props.post.authorCID) {
			// Viewing own post
			this.authorName = this.$store.state.session.name
			this.authorID = this.$store.state.session.id
			this.authorCID = this.$store.state.session.cid
		}
		this.$getProfile(this.$props.post.authorCID).then((profile) => {
			// Populate Avatar
			this.authorName = profile.name
			this.authorID = profile.id
			this.authorCID = profile.cid
			if (profile.avatar !== ``) {
				this.$getPhoto(profile.avatar).then((image) => {
					this.avatar = image
				})
			}
			// Populate Featured Photo
			if (this.post.featuredPhotoCID !== ``) {
				this.$getPhoto(this.post.featuredPhotoCID).then((image) => {
					this.featuredPhoto = image
				})
			}
		})
		// Set filter dropdown event handler
		window.addEventListener(`click`, this.handleDropdown, false)
	},
	destroyed() {
		window.removeEventListener(`click`, this.handleDropdown)
	},
	methods: {
		handleDropdown(e: any): void {
			if (!e.target || e.target.parentNode.classList.contains(`hotzone`)) {
				return
			}
			if (
				e.target.parentNode === null ||
				e.target.parentNode.classList === undefined ||
				!e.target.parentNode.classList.contains(`toggle`)
			) {
				this.showFilter = false
			}
		},
		getStyles(): string {
			let res = ``
			if (this.showComments && this.$store.state.settings.darkMode) {
				res += `text-lightActive`
			} else if (this.showComments && !this.$store.state.settings.darkMode) {
				res += `text-darkActive`
			} else if (!this.showComments && this.$store.state.settings.darkMode) {
				res += `hover:text-lightActive`
			} else if (!this.showComments && !this.$store.state.settings.darkMode) {
				res += `hover:text-darkActive`
			}
			return res
		},
		setCommentFilterFeeling(feeling) {
			this.feeling = feeling
			this.showFilter = true
		},
		setCommentFilter(reaction) {
			this.filter = reaction
			this.showFilter = false
		},
	},
})
</script>
