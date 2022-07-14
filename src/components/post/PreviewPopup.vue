<template>
	<div
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="$emit(`close`)"
	>
		<!-- Container -->
		<section class="popup w-full lg:w-11/12 xl:w-10/12 max-w-1220" style="margin-top: 88px">
			<div
				class="w-full max-h-90 h-full bg-lightBG dark:bg-darkBGStop card-animation z-10 overflow-y-auto rounded-lg shadow-lg flex justify-center"
			>
				<!-- Inner post area -->
				<div class="w-full lg:w-760 lg:max-w-760">
					<!-- Magic header that disappears on scroll down -->
					<header
						id="header"
						class="page-header bg-lightBG dark:bg-darkBG border-b border-r border-l border-lightBorder shadow-sm sticky top-0 z-10 flex w-full items-center rounded-b-lg py-2 px-5"
					>
						<div class="trigger-menu-wrapper flex w-full justify-center py-2 ease-in-out">
							<div class="flex w-full justify-between xl:min-w-max xl:max-w-3xl">
								<!-- Eyecon and preview mode text -->
								<div class="flex items-center">
									<PreviewIcon />
									<h6 class="text-xs lg:text-sm text-gray5 dark:text-gray3 ml-4">Preview Mode</h6>
								</div>
								<span class="flex items-center">
									<BrandedButton :text="`Ready to publish?`" />
									<button
										class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1 ml-4"
										@click="$emit(`close`)"
									>
										<XIcon />
									</button>
								</span>
							</div>
						</div>
					</header>

					{{ post }}
				</div>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import PreviewIcon from '@/components/icons/Preview.vue'
import XIcon from '@/components/icons/X.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import { Post } from '@/backend/post'

interface IData {
	post: Post
}

export default Vue.extend({
	components: { PreviewIcon, XIcon, BrandedButton },
	data(): IData {
		const p = this.$store.state.draft.drafts[this.$store.state.draft.activeIndex]
		return {
			post: p,
		}
	},
	methods: {},
})
</script>
