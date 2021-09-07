<template>
	<div class="flex">
		<div class="flex-shrink-0">
			<img v-if="reply.authorAvatarCID !== null" :src="this.avatar" class="w-10 h-10 rounded-lg object-cover" />
			<span v-else class="p-1 border-2 rounded-full block">
				<ProfileIcon class="w-6 h-6" />
			</span>
		</div>
		<div class="flex-1 leading-relaxed ml-2">
			<strong
				:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
				class="font-bold bold mr-1"
			>
				{{ getFullName(reply.authorID) }}
			</strong>
			<nuxt-link
				:to="this.$props.reply.authorCID"
				:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
				class="text-sm mr-2"
			>
				@{{ reply.authorID }}
			</nuxt-link>
			<span
				v-if="reply.timestamp"
				class="text-xs"
				:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
			>
				{{ $formatDate(reply.timestamp) }}
			</span>
			<p
				:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
				class="text-sm py-1"
			>
				{{ reply.content }}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import ProfileIcon from '@/components/icons/Person.vue'
import ipfs from '@/backend/ipfs'

export default Vue.extend({
	components: {
		ProfileIcon,
	},
	props: {
		reply: {
			type: Object,
			default: null,
		},
	},
	data() {
		return {
			avatar: ``,
		}
	},
	async created() {
		if (this.$props.reply.authorAvatarCID !== null) {
			this.avatar = await ipfs().getPhoto(this.$props.reply.authorAvatarCID)
		}
	},
	methods: {
		getFullName(id: string) {
			return id
		},
	},
})
</script>
