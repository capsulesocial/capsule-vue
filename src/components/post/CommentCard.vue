<template>
	<article
		class="object-contain"
		style="width: 616px; margin-top: 22px; margin-bottom: 22px"
		:class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
	>
		<!-- Top: avatar, name, id, timestamp then close icon,  -->
		<div v-if="commentData" class="flex w-full">
			<div class="flex justify-between items-start mr-4">
				<span class="rounded-lg p-1 flex-shrink-0" :class="`bg-` + getCategory(comment.emotion)">
					<Avatar :avatar="avatar" :authorID="comment.authorID" size="w-12 h-12" />
				</span>
			</div>
			<!-- Dashed bubble -->
			<div
				class="border rounded-lg h-32 w-full flex justify-between border-dashed"
				:class="`border-` + getCategory(comment.emotion)"
			>
				<!-- Text -->
				<div class="flex flex-col flex-grow w-full px-4 py-2">
					<!-- Top row: name, id, timestamp -->
					<div class="flex">
						<nuxt-link :to="'/' + comment.authorID" class="flex mr-4 flex-row items-center">
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
						<div class="text-xs self-center">
							{{ $formatDate(comment.timestamp) }}
						</div>
					</div>
					<!-- Content -->
					<div class="flex flex-col flex-grow w-full p-2">
						<nuxt-link :to="`/post/` + commentData.parentCID" class="text-lg">
							{{ commentData.content }}
						</nuxt-link>
					</div>
				</div>
				<!-- Image -->
				<div class="flex-shrink-0 flex justify-center items-center pr-4">
					<nuxt-link :to="`/post/` + commentData.parentCID" class="text-lg">
						<img :src="emotion.imageLeft" :alt="emotion.label" class="bg-white rounded-full w-24 h-24" />
					</nuxt-link>
				</div>
			</div>
		</div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import Avatar from '@/components/Avatar.vue'
import { reactions, feelings } from '@/config'
import { getComment, INewCommentData } from '@/backend/comment'
import { Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'
import { getPost, Post } from '@/backend/post'

interface IData {
	avatar: string
	commentData: INewCommentData | null
	emotion: { label: string; imageLeft: any; imageRight: any } | null
	postData: Post | {}
}

export default Vue.extend({
	components: {
		Avatar,
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
		getCategory(emotion: string) {
			if (feelings.positive.includes(emotion)) {
				return `positive`
			} else if (feelings.negative.includes(emotion)) {
				return `negative`
			} else {
				return `neutral`
			}
		},
	},
})
</script>