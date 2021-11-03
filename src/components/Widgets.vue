 <template>
	<div>
		<!-- Discover page -->
		<TagsWidget class="rounded-lg shadow-lg bg-gradient-to-r from-lightBGStart to-lightBGStop backdrop-filter backdrop-blur-lg border border-lightBorder mb-5" />
		<DraftsWidget class="rounded-lg shadow-lg bg-gradient-to-r from-lightBGStart to-lightBGStop backdrop-filter backdrop-blur-lg border border-lightBorder mb-5" />
		<!-- Configure my Capsule -->
		<button
			class="rounded-lg shadow-lg bg-white mb-5 w-full focus:outline-none"
			style="height: 64px; background-position: center; background-size: cover; background-repeat: no-repeat"
			:style="{ backgroundImage: `url(${require(`@/assets/images/brand/configure-my-capsule.png`)})` }"
		>
			<p class="text-primary text-right">
				<span class="bg-white p-2 rounded-full" style="background: opacity 0.9em">Configure my Capsule</span>
			</p>
		</button>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import TagsWidget from '@/components/widgets/Tags.vue'
import DraftsWidget from '@/components/widgets/Drafts.vue'

export default Vue.extend({
	components: {
		TagsWidget,
		DraftsWidget,
	},
})
</script>