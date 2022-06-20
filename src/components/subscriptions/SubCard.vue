<template>
	<div
		class="w-full sm:w-56 mr-2 mb-4 flex flex-col border border-lightBorder dark:border-darkBorder shadow-sm rounded-lg from-lightBGStart to-lightBGStop dark:from-darkBG dark:to-darkBG bg-gradient-to-r items-center p-4"
	>
		<div class="w-full flex justify-end -mt-2">
			<div class="icon relative flex items-center">
				<button class="focus:outline-none text-gray5 dark:text-gray3 ml-2" @click.stop="toggleDropdownEdit">
					<MoreIcon />
				</button>
				<div
					v-show="showEdit"
					class="bg-lightBG dark:bg-darkBG dark:text-darkPrimaryText text-lightPrimaryText border-lightBorder modal-animation absolute z-10 flex w-44 flex-col rounded-lg border p-2 shadow-lg"
					:class="$colorMode.dark ? `dropdownSubOpenDark` : `dropdownSubOpen`"
					style="top: 35px; right: -5px"
				>
					<button
						class="focus:outline-none text-primary flex justify-center items-center"
						@click="$emit(`infoPopup`, s)"
					>
						<PenIcon class="fill-current h-4 w-4" />
						<span class="text-primary ml-2 self-center text-xs">Manage Subscription</span>
					</button>
				</div>
			</div>
		</div>
		<Avatar :avatar="avatar" :authorID="s.authorID" :size="`w-12 h-12 xl:w-14 xl:h-14`" class="mb-4" />
		<h5
			v-if="s.name !== ``"
			class="w-full text-center font-semibold text-lg text-lightPrimaryText dark:text-darkPrimaryText truncate"
		>
			{{ s.name }}
		</h5>
		<h5 v-else class="w-full text-center font-semibold text-lg text-gray5 dark:text-gray3 truncate">
			{{ s.authorID }}
		</h5>
		<h6 class="text-primary w-full text-center truncate">@{{ s.authorID }}</h6>
		<!-- Crown with tier label -->
		<div
			class="w-full border border-neutral rounded-lg flex flex-row justify-center items-center bg-neutral bg-opacity-25 p-2 my-4 max-w-full"
		>
			<CrownIcon class="text-neutral mr-2 w-5 h-5" /><span class="truncate text-neutral">{{ s.tier.name }}</span>
		</div>
		<div class="flex justify-center items-end mb-4 text-neutral">
			<p class="font-semibold text-lg">{{ currency }}{{ s.amount }}</p>
			<p>/</p>
			<p>{{ s.period }}</p>
		</div>
		<p class="text-gray5 dark:text-gray3 text-sm w-full mb-2">
			Subscribed since <span class="font-semibold">{{ $formatDate(s.createdAt, true) }}</span>
		</p>
		<p
			v-if="s.renewalInfo && s.renewalInfo.status === 'cancelled' && s.renewalInfo.dueDate"
			class="text-negative text-sm w-full"
		>
			Cancels on <span class="font-semibold">{{ $formatDate(s.renewalInfo.dueDate, true) }}</span>
		</p>
		<p v-else-if="s.expiredAt" class="text-gray5 dark:text-gray3 text-sm w-full">
			Next Renewal on <span class="font-semibold">{{ $formatDate(s.expiredAt, true) }}</span>
		</p>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import Avatar from '@/components/Avatar.vue'
import CrownIcon from '@/components/icons/Crown.vue'
import MoreIcon from '@/components/icons/More.vue'
import PenIcon from '@/components/icons/Pencil.vue'
import { ISubscriptionWithProfile } from '@/store/subscriptions'
import { getCurrencySymbol } from '@/backend/payment'

interface IData {
	avatar: string | ArrayBuffer
	showEdit: Boolean
	showPopup: Boolean
}

export default Vue.extend({
	components: { Avatar, CrownIcon, MoreIcon, PenIcon },
	props: {
		s: {
			type: Object as PropType<ISubscriptionWithProfile>,
			required: true,
		},
	},
	data(): IData {
		return {
			avatar: ``,
			showEdit: false,
			showPopup: false,
		}
	},
	computed: {
		currency(): string {
			return getCurrencySymbol(this.s.currency)
		},
	},
	async created() {
		if (this.s.avatar) {
			this.avatar = await getPhotoFromIPFS(this.s.avatar)
		}
		window.addEventListener(`click`, this.handleDropdown, false)
	},
	methods: {
		toggleDropdownEdit() {
			this.showEdit = !this.showEdit
		},
		toggleInfoPopup() {
			this.showPopup = !this.showPopup
		},
		handleDropdown(e: any): void {
			if (!e.target || e.target.parentNode === null || e.target.parentNode.classList === undefined) {
				return
			}
			if (!e.target.parentNode.classList.contains(`icon`)) {
				this.showEdit = false
			}
		},
	},
})
</script>

<style>
.dropdownSubOpen::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 0.5rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
}
.dropdownSubOpenDark::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 0.5rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #121212;
	border-radius: 2px;
}
</style>