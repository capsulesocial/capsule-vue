<template>
	<article
		class="shadow rounded-lg my-2 object-contain"
		style="width: 556px; margin-bottom: 22px; margin-top: 22px; padding: 16px"
		:class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText border border-darkBorder'"
	>
		<!-- Top: avatar, name, id, timestamp then close icon,  -->
		<div class="flex w-full">
			<Avatar :avatar="avatar" :authorID="comment.authorID" size="w-12 h-12" />
			<div class="flex flex-col flex-grow ml-4">
				<div class="flex">
					<nuxt-link :to="'/' + comment.authorID" class="flex mr-4">
						<span
							:class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
							class="font-medium text-base"
						>
							{{ profile.name }}
						</span>
						<span
							:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
							class="ml-2"
						>
							@{{ comment.authorID }}
						</span>
					</nuxt-link>
				</div>
				<!-- Timestamp -->
				<div class="text-xs ml-14">
					{{ $formatDate(comment.timestamp) }}
				</div>
			</div>
			<span v-if="comment.authorID !== $store.state.session.id" class="h-10 flex flex-row-reverse">
				<XIcon />
			</span>
		</div>
		<!-- Content -->
		<div v-if="commentData" class="flex my-4">
			<div class="flex flex-col flex-grow w-full pr-4">
				<nuxt-link :to="`/` + postData.authorID">
					<h4 class="text-xl text-primary">@{{ postData.authorID }}</h4>
				</nuxt-link>
				<nuxt-link :to="`/post/` + commentData.parentCID">
					<h6 class="text-lg">
						{{ commentData.content }}
					</h6>
				</nuxt-link>
			</div>
			<div class="flex-shrink-0 -mt-12 w-32 h-32">
				<img :src="emotion.image" :alt="emotion.label" class="bg-white rounded-full w-32 h-32" />
				<h5 class="text-center">{{ emotion.label }}</h5>
			</div>
		</div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import Avatar from '@/components/Avatar.vue'
import XIcon from '@/components/icons/X.vue'
import { reactions } from '@/config'
import { getComment, INewCommentData } from '@/backend/comment'
import { Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'
import { getPost, Post } from '@/backend/post'

interface IData {
	avatar: string
	commentData: INewCommentData | null
	emotion: { label: string; background: any; image: any } | null
	postData: Post | {}
}

export default Vue.extend({
	components: {
		Avatar,
		XIcon,
	},
	props: {
		comment: {
			type: Object as PropType<INewCommentData>,
			required: true,
		},
		profile: {
			type: Object as PropType<Profile>,
			default: null,
		},
	},
	data(): IData {
		return {
			avatar: ``,
			commentData: null,
			emotion: reactions.default,
			postData: {},
		}
	},
	async created() {
		// Fetch avatar
		if (this.$props.profile.avatar && this.$props.profile.avatar !== ``) {
			getPhotoFromIPFS(this.$props.profile.avatar).then((p) => {
				this.avatar = p
			})
		}
		// Get comment
		const c = await getComment(this.$props.comment.cid)
		this.commentData = c
		const emotion = c.emotion as keyof typeof reactions
		if (emotion in reactions) {
			this.emotion = reactions[emotion]
		}
		// Get initial post
		const p: Post = await getPost(this.commentData.parentCID)
		this.postData = p
	},
	methods: {
		getComment,
	},
})
</script>