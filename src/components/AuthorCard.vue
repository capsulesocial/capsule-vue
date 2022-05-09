<template>
	<div class="my-5 border-t border-b py-5 dark:border-gray7">
		<div class="flex flex-col items-center justify-between lg:flex-row">
			<div>
				<h6 class="text-gray5 dark:text-gray3 mb-4 font-sans text-sm">Written By:</h6>
				<div class="flex pr-5">
					<Avatar :avatar="authorAvatar" :authorID="authorID" size="w-16 h-16" class="flex-shrink-0 self-start" />
					<div class="mx-4">
						<nuxt-link v-if="authorName != ``" :to="'/id/' + authorID" class="text-2xl dark:text-darkPrimaryText">
							{{ authorName }}
						</nuxt-link>
						<nuxt-link v-else :to="'/id/' + authorID" class="text-gray5 text-2xl"> {{ authorID }} </nuxt-link>
						<div v-show="authorBio" id="bio" ref="bio" style="max-height: 6rem; overflow: hidden">
							<p
								v-for="(line, lineNumber) of authorBio.split('\n')"
								:key="lineNumber"
								class="text-gray5 dark:text-darkSecondaryText w-full"
							>
								{{ line.slice(0, 280) + (line.length > 280 ? '...' : '') }}<br />
							</p>
						</div>
						<button v-show="longBio" class="focus:outline-none text-xs text-primary px-1" @click="expandBio = true">
							Read more
						</button>
					</div>
				</div>
			</div>
			<div class="mr-5 mt-3 xl:mt-0">
				<FriendButton
					v-if="authorID !== $store.state.session.id"
					class="hidden justify-self-end xl:block"
					:userIsFollowed="isFollowed"
					:toggleFriend="toggleFriend"
				/>
			</div>
		</div>
		<BioPopup v-if="expandBio" :bio="authorBio" @close="expandBio = false" />
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import FriendButton from '@/components/FriendButton.vue'
import Avatar from '@/components/Avatar.vue'
import BioPopup from '@/components/popups/BioPopup.vue'

interface IData {
	longBio: boolean
	expandBio: boolean
}

export default Vue.extend({
	components: {
		FriendButton,
		Avatar,
		BioPopup,
	},
	props: {
		authorAvatar: {
			type: String as PropType<ArrayBuffer | string | undefined>,
			default: undefined,
		},
		authorName: {
			type: String,
			required: true,
		},
		authorID: {
			type: String,
			required: true,
		},
		authorBio: {
			type: String,
			required: true,
		},
		isFollowed: {
			type: Boolean,
			required: true,
		},
		toggleFriend: {
			type: Function as PropType<() => void>,
			required: true,
		},
	},
	data(): IData {
		return {
			longBio: false,
			expandBio: false,
		}
	},
	mounted() {
		this.$nextTick(() => {
			if (this.$refs) {
				this.$nextTick(() => {
					const bioContainer = this.$refs.bio as HTMLElement
					if ((bioContainer && bioContainer.clientHeight > 72) || this.authorBio.length > 150) {
						this.longBio = true
					}
				})
			}
		})
	},
})
</script>
