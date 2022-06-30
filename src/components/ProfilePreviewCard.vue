<template>
	<div
		v-if="!isLoading"
		class="py-6 px-4 w-full xl:w-40 from-lightBGStart to-lightBGStop dark:from-darkBG dark:to-darkBG border border-lightBorder bg-gradient-to-r shadow-sm rounded-lg flex flex-col justify-center items-center text-center modal-animation"
	>
		<Avatar :authorID="profile.id" :avatar="avatar" size="w-14 h-14" />
		<div class="h-12 flex-grow w-full mt-2">
			<div class="flex flex-col items-center">
				<span v-if="profile.name != ``" class="text-base font-medium dark:text-darkPrimaryText truncate w-full">
					{{ profile.name }}
				</span>
				<span v-else class="text-gray5 dark:text-gray3 text-base font-medium truncate w-full"> {{ profile.id }} </span>
				<span class="text-gray5 dark:text-gray3 text-sm truncate w-full">@{{ profile.id }}</span>
			</div>
		</div>
		<button class="text-primary text-sm mt-2" @click="$emit(`manageNewsletter`, profile)">Manage</button>
	</div>
	<div
		v-else
		class="py-6 px-4 w-full xl:w-40 from-lightBGStart to-lightBGStop dark:from-darkBG dark:to-darkBG border border-lightBorder bg-gradient-to-r shadow-sm rounded-lg flex flex-col justify-center items-center text-center"
	>
		<div class="h-14 w-14 rounded-lg bg-gray1 dark:bg-gray7 animate-pulse mb-4"></div>
		<div class="h-4 w-20 rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-2"></div>
		<div class="h-3 w-20 rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-6"></div>
		<div class="h-2 w-14 rounded-xl bg-gray1 dark:bg-gray7 animate-pulse"></div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import Avatar from '@/components/Avatar.vue'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import { Profile } from '@/backend/profile'

interface IData {
	avatar?: string | ArrayBuffer
	isLoading: boolean
}

export default Vue.extend({
	name: `ProfilePreview`,
	components: {
		Avatar,
	},
	props: {
		profile: {
			type: Object as PropType<Profile>,
			default: null,
		},
	},
	data(): IData {
		return {
			avatar: undefined,
			isLoading: true,
		}
	},
	async created() {
		// fetch avatar
		if (this.profile.avatar !== null && this.profile.avatar !== ``) {
			this.avatar = await getPhotoFromIPFS(this.profile.avatar)
		}
		this.isLoading = false
	},
})
</script>
