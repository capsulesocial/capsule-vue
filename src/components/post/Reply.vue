<template>
	<div class="flex">
		<div class="flex-shrink-0">
			<Avatar :avatar="avatar" :authorID="authorID" size="w-10 h-10" />
		</div>
		<div class="ml-2 flex-1 leading-relaxed">
			<strong class="bold mr-1 font-bold text-lightPrimaryText">
				{{ name }}
			</strong>
			<nuxt-link :to="`/id/` + authorID" class="mr-2 text-sm text-lightSecondaryText"> @{{ authorID }} </nuxt-link>
			<span v-if="timestamp" class="text-xs text-lightSecondaryText">
				{{ $formatDate(timestamp) }}
			</span>
			<p class="py-1 text-sm text-lightPrimaryText">
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
			avatar: ``,
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
				const { profile } = await getProfile(this.authorID)
				if (profile) {
					p = profile
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
