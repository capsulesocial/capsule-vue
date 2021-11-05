 <template>
	<div>
		<!-- Discover page -->
		<TagsWidget
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
		/>
		<DraftsWidget
			v-if="!checkRoute()"
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
		/>
		<!-- Configure my Capsule -->
		<button
			v-if="!checkRoute()"
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
			style="height: 80px; background-repeat: no-repeat; background-position: -6em center; background-size: cover"
			:style="{ backgroundImage: `url(${require(`@/assets/images/brand/configure-my-capsule.png`)})` }"
		>
			<p class="text-primary text-right text-sm">
				<span class="p-6" style="background: opacity 0.9em">Configure my Capsule</span>
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
	methods: {
		checkRoute(): boolean {
			return this.$route.name?.substr(0, 8) === `discover`
		},
	},
})
</script>