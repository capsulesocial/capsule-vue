 <template>
	<div class="popup">
		<!-- Configure my Capsule overlay -->
		<div
			v-if="configureWidgets"
			class="
				popup
				fixed
				w-full
				h-screen
				bg-primary
				top-0
				bottom-0
				left-0
				right-0
				z-30
				flex
				justify-center
				items-center
				bg-opacity-50
			"
		>
			<ConfigureWidgets @close="toggleConfigure" @save="saveDraft" />
		</div>
		<FollowersWidget
			v-if="$store.state.widgets.secondary2 === `followers` && followers.size > 0"
			:followers="followers"
			:updateFollowers="updateFollowers"
			class="
				rounded-lg
				shadow-lg
				bg-gradient-to-r
				from-lightBGStart
				to-lightBGStop
				backdrop-filter backdrop-blur-lg
				border border-lightBorder
				overflow-hidden
				mb-5
			"
			style="backdrop-filter: blur(10px)"
		/>
		<TagsWidget
			v-if="$store.state.widgets.secondary2 === `tags`"
			class="
				rounded-lg
				shadow-lg
				bg-gradient-to-r
				from-lightBGStart
				to-lightBGStop
				backdrop-filter backdrop-blur-lg
				border border-lightBorder
				overflow-hidden
				mb-5
			"
			style="backdrop-filter: blur(10px)"
		/>
		<DraftsWidget
			v-if="$store.state.widgets.secondary === `drafts`"
			class="
				rounded-lg
				shadow-lg
				bg-gradient-to-r
				from-lightBGStart
				to-lightBGStop
				backdrop-filter backdrop-blur-lg
				border border-lightBorder
				mb-5
			"
			style="backdrop-filter: blur(10px)"
		/>
		<BookmarksWidgets
			v-if="$store.state.widgets.secondary === `bookmarks`"
			class="
				rounded-lg
				shadow-lg
				bg-gradient-to-r
				from-lightBGStart
				to-lightBGStop
				backdrop-filter backdrop-blur-lg
				border border-lightBorder
				mb-5
			"
			style="backdrop-filter: blur(10px)"
		/>
		<!-- Configure my Capsule -->
		<button
			class="
				rounded-lg
				shadow-lg
				bg-gradient-to-r
				from-lightBGStart
				to-lightBGStop
				backdrop-filter backdrop-blur-lg
				border border-lightBorder
				mb-5
				w-full
				focus:outline-none
			"
			style="
				height: 80px;
				background-repeat: no-repeat;
				background-position: -6em center;
				background-size: cover;
				background-color: rgba(256, 256, 256, 0.9);
				backdrop-filter: blur(10px);
			"
			:style="{ backgroundImage: `url(${require(`@/assets/images/brand/configure-my-capsule.png`)})` }"
			@click="toggleConfigure"
		>
			<p class="text-primary text-right text-sm">
				<span class="p-6" style="background: opacity 0.9em">Configure my Capsule</span>
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

interface IData {
	configureWidgets: boolean
}

export default Vue.extend({
	components: {
		TagsWidget,
		DraftsWidget,
		ConfigureWidgets,
		BookmarksWidgets,
		FollowersWidget,
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
		}
	},
	methods: {
		saveDraft(): void {
			this.$emit(`saveDraft`)
		},
		toggleConfigure() {
			this.configureWidgets = !this.configureWidgets
			this.$emit(`overlay`)
		},
	},
})
</script>