<template>
	<div class="flex">
		<div class="flex-shrink-0">
			<Avatar :avatar="avatar" :authorID="authorID" size="w-10 h-10" />
		</div>
		<div class="flex-1 leading-relaxed ml-2">
			<strong
				:class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
				class="font-bold bold mr-1"
			>
				{{ name }}
			</strong>
			<nuxt-link
				:to="authorID"
				:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
				class="text-sm mr-2"
			>
				@{{ authorID }}
			</nuxt-link>
			<span
				v-if="timestamp"
				class="text-xs"
				:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
			>
				{{ $formatDate(timestamp) }}
			</span>
			<p
				:class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
				class="text-sm py-1"
			>
				{{ content }}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import Avatar from '@/components/Avatar.vue'
import { getPhotoFromIPFS } from '@/backend/photos'
import { getComment } from '@/backend/comment'
import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import { getProfileFromSession } from '@/store/session'

interface IData {
	avatar?: string
	content: string
	name: string
}

export default Vue.extend({
	components: {
		Avatar,
	},
	props: {
		authorID: { type: String, required: true },
		cid: { type: String, required: true },
		timestamp: { type: Number, required: true },
		profile: { type: Object as PropType<Profile>, default: null },
	},
	data(): IData {
		return {
			content: ``,
			name: ``,
		}
	},
	async created() {
		const comment = await getComment(this.cid)
		this.content = comment.content
	},
	async mounted() {
		let p = this.profile
		if (!p) {
			if (this.$store.state.session.id === this.authorID) {
				// Viewing own post
				p = getProfileFromSession(this.$store.state.session)
			} else {
				// Viewing someone else's post
				p = createDefaultProfile(this.authorID)
				const fetchedProfile = await getProfile(this.authorID)
				if (fetchedProfile) {
					p = fetchedProfile
				}
			}
		}
		this.name = p.name
		if (p.avatar) {
			getPhotoFromIPFS(p.avatar).then((a) => {
				this.avatar = a
			})
		}
	},
	methods: {
		getFullName(id: string) {
			return id
		},
	},
})
</script>
