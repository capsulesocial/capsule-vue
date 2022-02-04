<template>
	<div class="relative flex items-end">
		<button
			class="focus:outline-none hover:text-primary toggle flex items-end"
			:class="showReposts ? 'text-primary' : ''"
			@click.stop="toggleDropdown"
		>
			<div class="text-gray5 hover:text-primary hover:fill-primary flex">
				<RepostIcon :isActive="isReposted" />
				<span class="ml-1">{{ repostCount + repostOffset }}</span>
			</div>
		</button>
		<div
			v-show="showReposts"
			:class="
				$store.state.settings.darkMode
					? 'bg-lightBG text-lightPrimaryText border-lightBorder'
					: 'bg-darkBG text-darkPrimaryText border-darkBorder'
			"
			class="border-lightBorder modal-animation dropdownRepostOpen absolute z-10 flex w-40 flex-col rounded-lg border p-2 shadow-lg"
			style="left: 50px"
		>
			<!-- Simple Repost -->
			<button
				:class="$store.state.settings.darkMode ? 'hover:text-lightActive' : 'hover:text-darkActive'"
				class="focus:outline-none text-gray5 flex mr-4 items-center"
				@click="handleRepost()"
			>
				<RepostIcon :isActive="isReposted" :shrink="true" class="mr-2 p-1" />
				<span v-if="isReposted" class="self-center text-xs">Undo Repost</span>
				<span v-else class="self-center text-xs">Repost to Feed</span>
			</button>
			<!-- Quote Repost -->
			<button
				:class="$store.state.settings.darkMode ? 'hover:text-lightActive' : 'hover:text-darkActive'"
				class="focus:outline-none text-gray5 flex mr-4 items-center"
				@click="$emit(`toggleRepost`)"
			>
				<QuoteIcon class="mr-2 p-1" />
				<span class="self-center text-xs">Quote</span>
			</button>
		</div>
		<input :id="cid" type="hidden" value="" class="hidden" />
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import RepostIcon from '@/components/icons/Repost.vue'
import QuoteIcon from '@/components/icons/Quote.vue'
import { Post } from '@/backend/post'
import { IRepost, sendRepost, getReposts } from '@/backend/reposts'
import { sendPostDeletion } from '@/backend/postDeletion'

interface IData {
	showReposts: boolean
	isReposted: boolean
	repostOffset: number
}

export default Vue.extend({
	components: {
		RepostIcon,
		QuoteIcon,
	},
	props: {
		repost: {
			type: Object as PropType<IRepost>,
			default: null,
		},
		post: {
			type: Object as PropType<Post>, // TODO fix the post type,
			required: true,
		},
		cid: {
			type: String,
			required: true,
		},
		hasRepost: {
			type: Function,
			required: true,
		},
		repostCount: {
			type: Number,
			required: true,
		},
	},
	data(): IData {
		return {
			showReposts: false,
			isReposted: false,
			repostOffset: 0,
		}
	},
	created() {
		this.isReposted = this.$store.getters.checkReposts(this.cid)
		// Unauth
		if (this.$store.state.session.id === ``) {
			this.isReposted = false
		}
		window.addEventListener(
			`click`,
			(e: any): void => {
				if (!e.target) {
					return
				}
				if (
					e.target.parentNode === null ||
					e.target.parentNode.classList === undefined ||
					!e.target.parentNode.classList.contains(`toggle`)
				) {
					this.showReposts = false
				}
			},
			false,
		)
	},
	methods: {
		sendRepost,
		getReposts,
		async handleRepost() {
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			// Post has NOT been reposted
			if (!this.isReposted) {
				const repostCID = await sendRepost(this.$store.state.session.id, this.cid, ``, `simple`)
				this.$store.commit(`addRepost`, { postID: this.cid, repostID: repostCID })
				this.$toastSuccess(`You have successfully reposted this post`)
				this.isReposted = true
				this.repostOffset += 1
			} else {
				// Undo repost
				// What do I call to undo a simple repost???
				const repostID = this.$store.state.reposts[this.cid]
				await sendPostDeletion(`HIDE`, repostID, this.$store.state.session.id)
				this.$store.commit(`removeRepost`, this.cid)
				this.isReposted = false
				this.repostOffset -= 1
				this.$toastSuccess(`This repost has been successfully removed from your profile`)
			}
		},
		toggleDropdown() {
			this.showReposts = !this.showReposts
		},
	},
})
</script>
<style>
.dropdownRepostOpen::before {
	content: '';
	position: absolute;
	top: 2.6rem;
	left: -0.5rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
}
</style>
