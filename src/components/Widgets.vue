 <template>
	<div>
		<!-- Discover page -->
		<TagsWidget class="rounded-lg shadow-lg bg-gradient-to-r from-lightBGStart to-lightBGStop backdrop-filter backdrop-blur-lg border border-lightBorder mb-5" />
		<DraftsWidget class="rounded-lg shadow-lg bg-gradient-to-r from-lightBGStart to-lightBGStop backdrop-filter backdrop-blur-lg border border-lightBorder mb-5" />
		<!-- Configure my Capsule -->
		<article class="rounded-lg shadow-lg bg-gradient-to-r from-lightBGStart to-lightBGStop backdrop-filter backdrop-blur-lg border border-lightBorder mb-5">
			<button class="p-4">
				<div class="flex flex-row justify-between">
					<!-- <img :src="require(`@/assets/images/brand/help-page.png`)" /> -->
					<div class="flex flex-row text-primary items-center">
						<p class="pr-2">Configure my Capsule</p>
						<SettingsIcon />
					</div>
				</div>
			</button>
		</article>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import TagsWidget from '@/components/widgets/Tags.vue'
import DraftsWidget from '@/components/widgets/Drafts.vue'
import SettingsIcon from '@/components/icons/Settings.vue'

export default Vue.extend({
	components: {
		TagsWidget,
		DraftsWidget,
		SettingsIcon,
	},
})
</script>