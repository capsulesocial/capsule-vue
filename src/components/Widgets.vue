<template>
	<div class="popup">
		<!-- Configure my Blogchain overlay -->
		<div
			v-if="configureWidgets"
			class="popup bg-darkBG dark:bg-gray7 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
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
			class="from-lightBGStart to-lightBGStop border-lightBorder dark:from-darkBGStart dark:to-darkBGStop mb-5 overflow-hidden rounded-lg border bg-gradient-to-r shadow-lg backdrop-blur-lg backdrop-filter"
			style="backdrop-filter: blur(10px)"
			@openFollowers="$emit(`openFollowers`)"
		/>
		<TagsWidget
			v-if="$store.state.widgets.secondary2 === `tags`"
			class="from-lightBGStart to-lightBGStop border-lightBorder dark:from-darkBGStart dark:to-darkBGStop mb-5 overflow-hidden rounded-lg border bg-gradient-to-r shadow-lg backdrop-blur-lg backdrop-filter"
			style="backdrop-filter: blur(10px)"
		/>
		<DraftsWidget
			v-if="$store.state.widgets.secondary === `drafts`"
			class="from-lightBGStart to-lightBGStop border-lightBorder dark:from-darkBGStart dark:to-darkBGStop mb-5 rounded-lg border bg-gradient-to-r shadow-lg backdrop-blur-lg backdrop-filter"
			style="backdrop-filter: blur(10px)"
			@handleDraftPopup="handleDraftPopup"
		/>
		<BookmarksWidgets
			v-if="$store.state.widgets.secondary === `bookmarks`"
			class="from-lightBGStart to-lightBGStop border-lightBorder dark:from-darkBGStart dark:to-darkBGStop mb-5 rounded-lg border bg-gradient-to-r shadow-lg backdrop-blur-lg backdrop-filter"
			style="backdrop-filter: blur(10px)"
		/>
		<!-- Configure my Blogchain -->
		<button
			class="bg-lightBG dark:bg-darkBGStart from-lightBGStart to-lightBGStop border-lightBorder dark:from-darkBGStart dark:to-darkBGStop focus:outline-none mb-5 w-full rounded-lg border bg-gradient-to-r shadow-lg"
			style="
				height: 80px;
				background-repeat: no-repeat;
				background-position: -6em center;
				background-size: cover;
				backdrop-filter: blur(10px);
			"
			:style="{ backgroundImage: `url(${require(`@/assets/images/brand/configure-my-capsule.webp`)})` }"
			@click="toggleConfigure"
		>
			<p class="text-primary dark:text-secondary text-right text-sm flex flex-row justify-end">
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
			type: Set,
			default: new Set(),
		},
		updateFollowers: {
			type: Function as PropType<() => void>,
			required: true,
		},
	},
	data(): IData {
		return {
			configureWidgets: false,
			showDraftsPopup: false,
		}
	},
	methods: {
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
