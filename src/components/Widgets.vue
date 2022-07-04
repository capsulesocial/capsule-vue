<template>
	<div class="popup">
		<!-- Configure my Blogchain overlay -->
		<div
			v-if="configureWidgets"
			class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		>
			<ConfigureWidgets @close="toggleConfigure" @save="saveDraft" />
		</div>
		<!-- Drafts popup -->
		<div
			v-if="showDraftsPopup"
			class="popup modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		>
			<DraftsPopup @close="handleDraftPopup" />
		</div>
		<FollowersWidget
			v-if="$store.state.widgets.secondary2 === `followers` && followers.size > 0"
			:followers="followers"
			:updateFollowers="updateFollowers"
			class="bg-lightBG dark:bg-darkBGStop mb-5 overflow-hidden rounded-lg border border-lightBorder shadow-lg"
			@openFollowers="$emit(`openFollowers`)"
		/>
		<TagsWidget
			v-if="$store.state.widgets.secondary2 === `tags`"
			class="bg-lightBG dark:bg-darkBGStop mb-5 overflow-hidden rounded-lg border border-lightBorder shadow-lg"
		/>
		<DraftsWidget
			v-if="$store.state.widgets.secondary === `drafts`"
			class="bg-lightBG dark:bg-darkBGStop mb-5 rounded-lg border border-lightBorder shadow-lg"
			@handleDraftPopup="handleDraftPopup"
		/>
		<BookmarksWidgets
			v-if="$store.state.widgets.secondary === `bookmarks`"
			ref="bookmarksWidget"
			class="bg-lightBG dark:bg-darkBGStop mb-5 rounded-lg border border-lightBorder shadow-lg"
		/>
		<!-- Configure my Blogchain -->
		<button
			class="bg-lightBG dark:bg-darkBGStop focus:outline-none mb-5 w-full rounded-lg border border-lightBorder shadow-lg"
			style="height: 80px; background-repeat: no-repeat; background-position: -6em center; background-size: cover"
			:style="{ backgroundImage: `url(${require(`@/assets/images/brand/configure-my-capsule.webp`)})` }"
			@click="toggleConfigure"
		>
			<p class="text-primary text-right text-sm flex flex-row justify-end">
				<span class="p-6 xl:pr-0" style="background: opacity 0.9em">Configure</span>
				<span class="p-6 pl-1 hidden xl:block">my Blogchain</span>
			</p>
		</button>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'

import TagsWidget from '@/components/widgets/Tags.vue'
import DraftsWidget from '@/components/widgets/Drafts.vue'
import ConfigureWidgets from '@/components/widgets/Configure.vue'
import BookmarksWidgets from '@/components/widgets/Bookmarks.vue'
import FollowersWidget from '@/components/widgets/Followers.vue'
import DraftsPopup from '@/components/popups/DraftsPopup.vue'

interface IData {
	configureWidgets: boolean
	showDraftsPopup: boolean
}

export default Vue.extend({
	components: {
		TagsWidget,
		DraftsWidget,
		ConfigureWidgets,
		BookmarksWidgets,
		FollowersWidget,
		DraftsPopup,
	},
	props: {
		followers: {
			type: Set as PropType<Set<string>>,
			default: new Set<string>(),
		},
	},
	data(): IData {
		return {
			configureWidgets: false,
			showDraftsPopup: false,
		}
	},
	methods: {
		fetchBookmarks() {
			// @ts-ignore-next-line
			this.$refs.bookmarksWidget.fetchBookmarks()
		},
		updateFollowers(): void {
			this.$emit(`updateFollowers`)
		},
		saveDraft(): void {
			this.$emit(`saveDraft`)
		},
		toggleConfigure() {
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			this.configureWidgets = !this.configureWidgets
			this.$emit(`overlay`)
		},
		handleDraftPopup() {
			this.showDraftsPopup = !this.showDraftsPopup
			this.$emit(`overlay`)
		},
	},
})
</script>
