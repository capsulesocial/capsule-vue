<template>
	<article v-if="!postDeleted" class="object-contain" :class="showProfileCard ? `z-20` : `z-10`">
		<!-- popup post -->
		<portal to="card-popup">
			<div
				v-if="showPopup"
				class="bg-darkBG dark:bg-gray7 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
			>
				<div
					class="card lg:w-750 max-h-90 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop card-animation m-2 mt-10 w-full overflow-y-auto overflow-x-hidden rounded-lg bg-gradient-to-r shadow-lg lg:m-0"
					style="backdrop-filter: blur(10px)"
				>
					<div
						class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop sticky top-0 z-40 bg-gradient-to-r px-4 py-4 lg:px-6 lg:py-5"
						style="backdrop-filter: blur(10px)"
					>
						<!-- Show Quote Repost input -->
						<div v-if="showRepostEditor" class="flex flex-row pb-4">
							<Avatar :authorID="$store.state.session.id" :avatar="myAvatar" class="flex-shrink-0" />
							<textarea
								ref="repostText"
								v-model="quoteContent"
								class="focus:outline-none ml-4 mt-2 w-full resize-none bg-transparent placeholder-gray5 dark:placeholder-gray3 dark:text-darkPrimaryText"
								placeholder="What's your response?"
							></textarea>
							<button
								class="bg-gray1 dark:bg-gray5 focus:outline-none absolute right-0 top-0 m-6 rounded-full p-1"
								@click="handleCloseButton"
							>
								<XIcon />
							</button>
						</div>
						<!-- Wrapper for rounded outline on quote repost -->
						<div :class="showRepostEditor || quote ? `lg:bg-lightBorder lg:dark:bg-darkInput rounded-lg lg:p-4` : ``">
							<!-- Simple repost -->
							<div
								v-if="repostedBy !== `` && !hideRepostIcon && quote === null"
								class="text-gray5 dark:text-gray3 -mt-2 mb-4 flex w-full items-center pt-2 lg:mb-3"
							>
								<RepostIcon class="hidden lg:block" style="width: 15px; height: 15px" :shrink="true" />
								<p class="text-gray5 dark:text-gray3 hidden pl-2 text-sm lg:block">
									<nuxt-link v-if="repostedBy != ``" :to="`/id/` + repostedBy">{{ repostedBy }} </nuxt-link>
									<nuxt-link v-else :to="`/id/` + repostedBy">{{ repostedBy }}</nuxt-link>
									reposted
								</p>
							</div>
							<!-- Top: avatar, name, id, close -->
							<div class="flex w-full justify-between">
								<div class="flex flex-row">
									<div @mouseover="triggerPopupCardTrue" @mouseleave="triggerPopupCardFalse">
										<Avatar
											:avatar="avatar"
											:authorID="post.authorID"
											size="w-12 h-12"
											class="hidden lg:block transition ease-in-out hover:opacity-75"
										/>
									</div>
									<div class="ml-4 hidden flex-grow flex-col lg:flex">
										<CardProfileHeader
											:authorID="post.authorID"
											:authorName="authorName"
											@mouseover="triggerPopupCardTrue"
											@mouseleave="triggerPopupCardFalse"
										/>
										<!-- Timestamp -->
										<span class="text-xs dark:text-gray3">
											{{ $formatDate(post.timestamp) }}
										</span>
									</div>
								</div>
								<div
									v-show="showPopupCard && !showRepostEditor"
									class="border-lightBorder modal-animation-delay absolute z-40 flex w-72 flex-col rounded-lg border bg-lightBG dark:bg-darkBG p-4 shadow-lg"
									:style="repostedBy ? (quote ? `top: 100px` : `top: 110px`) : `top: 80px`"
									@mouseover="triggerPopupCardTrue"
									@mouseleave="showPopupCard = false"
								>
									<div class="w-full flex flex-row justify-between items-center mb-4">
										<Avatar :avatar="avatar" :authorID="post.authorID" size="w-16 h-16" />
										<FriendButton
											v-if="post.authorID !== $store.state.session.id && $route.name !== `id`"
											:small="true"
											:userIsFollowed="
												this.$route.name === `id-id` ? userIsFollowed : usersFollowing.has(post.authorID)
											"
											:toggleFriend="() => toggleFriend(post.authorID)"
										/>
									</div>
									<CardProfileHeader :authorID="post.authorID" :authorName="authorName" :isHoverCard="true" />
									<span v-if="authorBio !== ``" class="mt-2 dark:text-darkPrimaryText"> {{ authorBio }} </span>
								</div>
								<div
									class="relative flex w-full items-center justify-center lg:w-1/5 lg:justify-end"
									:class="repostedBy !== `` ? `-mt-4` : ``"
								>
									<!-- Bookmarks button -->
									<BookmarkButton
										:postID="postCID"
										:hasBookmark="isBookmarked"
										class="hidden lg:block"
										@clicked="getBookmarkStatus"
									/>
									<button
										v-if="post.authorID === $store.state.session.id"
										class="focus:outline-none text-gray5 dark:text-gray3 ml-2 hidden lg:block"
										@click.stop="toggleDropdownDelete"
									>
										<More />
									</button>
									<button
										v-show="!showRepostEditor"
										class="bg-gray1 dark:bg-gray5 focus:outline-none right-0 top-0 ml-0 rounded-full p-1 lg:ml-4"
										@click="handleCloseButton"
									>
										<XIcon />
									</button>
									<div
										v-show="showDelete"
										class="border-lightBorder modal-animation absolute z-10 flex w-36 flex-col rounded-lg border bg-lightBG dark:bg-darkBG p-1 shadow-lg"
										:class="$colorMode.dark ? `dropdownDeleteOpenDark` : `dropdownDeleteOpen`"
										:style="
											quote && quote.authorID === $store.state.session.id
												? `top: 55px; right: 40px`
												: `top: 45px; right: 40px`
										"
									>
										<!-- Delete -->
										<button class="focus:outline-none text-negative flex" @click="deletePost">
											<BinIcon class="p-1" />
											<span class="text-negative self-center text-xs">Remove from feed</span>
										</button>
									</div>
								</div>
							</div>
							<!-- Content -->
							<div class="mt-4 hidden flex-col justify-between lg:flex lg:flex-row">
								<!-- Left side: Title, subtitle / preview, tags -->
								<div class="mr-4 w-full">
									<nuxt-link :to="'/post/' + postCID">
										<div class="flex max-w-full flex-col overflow-hidden pr-4">
											<h3 class="break-words pb-2 text-lg font-semibold dark:text-darkPrimaryText">
												{{ post.title }}
											</h3>
											<h6
												v-if="(post.subtitle || post.excerpt) && featuredPhoto"
												class="max-w-420 break-words dark:text-darkSecondaryText"
											>
												{{ post.subtitle ? post.subtitle : postExcerpt() }}
											</h6>
											<h6
												v-if="(post.subtitle || post.excerpt) && !featuredPhoto"
												class="max-w-mobileCard lg:max-w-700 break-words text-lightSecondaryText dark:text-darkSecondaryText"
											>
												{{ post.subtitle ? post.subtitle : postExcerpt() }}
											</h6>
										</div>
									</nuxt-link>
									<!-- Display tags (Desktop) -->
									<div class="my-2 hidden overflow-x-auto lg:flex lg:flex-wrap text-lg">
										<TagPill v-for="t in post.tags" :key="t.name" :tag="t.name" class="my-2 mr-4" />
									</div>
								</div>
								<!-- Right side: Image -->
								<div v-if="featuredPhoto !== ``" class="mt-2 w-full flex-shrink-0 lg:mt-0 lg:w-56">
									<nuxt-link :to="'/post/' + postCID">
										<img :src="featuredPhoto" class="h-48 w-full flex-shrink-0 rounded-lg object-cover lg:h-32" />
									</nuxt-link>
								</div>
							</div>
						</div>
						<!-- Repost POST button -->
						<div
							v-if="showRepostEditor"
							class="flex flex-row-reverse pt-4"
							:class="quoteContent !== `` ? '' : 'opacity-50'"
							style="transition: all 0.4s"
						>
							<button
								class="bg-primary dark:bg-secondary focus:outline-none block rounded-lg lg:hidden"
								style="margin-right: 15.2px; margin-bottom: 15px"
								@click="handleSendRepost"
							>
								<SendIcon class="m-2 mb-3 ml-3 h-5 w-5 text-darkPrimaryText transform rotate-45" />
							</button>
							<BrandedButton :action="handleSendRepost" :text="`Quote`" class="hidden lg:block" />
						</div>
					</div>
					<PostActions
						v-if="showComments || showStats"
						:postCID="postCID"
						:postAuthor="post.authorID"
						:bookmarksCount="bookmarksCount"
						:repostsCount="repostCount"
						:openStats="showStats"
						class="px-4 pb-4 xl:px-6 xl:pb-6"
					/>
				</div>
			</div>
			<SharePopup
				v-if="showShare"
				:image="featuredPhoto"
				:title="post.title"
				:subtitle="post.subtitle"
				:excerpt="post.excerpt"
				:authorID="post.authorID"
				:cid="postCID"
				@close="showShare = false"
			/>
		</portal>
		<!-- Feed view -->
		<div v-if="this.$route.name !== `post-post`">
			<div class="card">
				<div
					class="sticky top-0 border-b dark:border-darkBG dark:border-opacity-25 py-4 px-5 xl:py-5 xl:px-6 transition ease-in-out hover:bg-gray1 dark:hover:bg-darkBG hover:bg-opacity-25 dark:hover:bg-opacity-25"
					style="backdrop-filter: blur(10px)"
					:class="showProfileCard || showQuoteCard ? `z-20` : `z-10`"
				>
					<!-- Quote repost -->
					<div v-if="quote">
						<div class="flex w-full justify-between">
							<div class="flex flex-row">
								<div @mouseover="triggerQuoteCardTrue" @mouseleave="triggerQuoteCardFalse">
									<Avatar
										:avatar="quote.avatar"
										:authorID="quote.authorID"
										size="w-12 h-12 transition ease-in-out hover:opacity-75"
									/>
								</div>
								<div class="ml-4 flex flex-grow flex-col">
									<div @mouseover="triggerQuoteCardTrue" @mouseleave="triggerQuoteCardFalse">
										<nuxt-link :to="`/id/` + quote.authorID" class="mr-4 flex">
											<span
												v-if="this.quote.name != ``"
												class="text-base font-medium transition ease-in-out hover:underline dark:text-darkPrimaryText"
												>{{ this.quote.name }}</span
											>
											<span
												v-else
												class="text-gray5 dark:text-gray3 text-base font-medium transition ease-in-out hover:underline"
												>{{ this.quote.authorID }}</span
											>
											<span class="text-primary dark:text-secondary ml-2">@{{ this.quote.authorID }}</span>
										</nuxt-link>
									</div>
									<span class="text-xs dark:text-gray3">{{ $formatDate(this.quote.timestamp) }}</span>
								</div>
							</div>
							<div
								v-show="showQuoteCard"
								class="border-lightBorder modal-animation-delay absolute z-40 flex w-72 flex-col rounded-lg border bg-lightBG dark:bg-darkBG p-4 shadow-lg"
								style="top: 80px"
								@mouseover="triggerQuoteCardTrue"
								@mouseleave="showQuoteCard = false"
							>
								<div class="w-full flex flex-row justify-between items-center mb-4">
									<Avatar :avatar="quote.avatar" :authorID="quote.authorID" size="w-16 h-16 transition ease-in-out" />
									<FriendButton
										v-if="quote.authorID !== $store.state.session.id && $route.name !== `id`"
										:small="true"
										:userIsFollowed="this.$route.name === `id-id` ? userIsFollowed : usersFollowing.has(quote.authorID)"
										:toggleFriend="() => toggleFriend(quote.authorID)"
									/>
								</div>
								<nuxt-link :to="'/id/' + quote.authorID" class="mr-4 flex flex-col">
									<span
										v-if="quote.name != ``"
										class="text-base font-bold transition ease-in-out hover:underline dark:text-darkPrimaryText"
									>
										{{ quote.name }}
									</span>
									<span
										v-else
										class="text-gray5 dark:text-gray3 text-base font-bold transition ease-in-out hover:underline"
									>
										{{ quote.authorID }}
									</span>
									<span class="text-primary dark:text-secondary"> @{{ quote.authorID }} </span>
								</nuxt-link>
								<span v-if="quote.bio !== ``" class="mt-2 dark:text-darkPrimaryText"> {{ quote.bio }} </span>
							</div>
							<!-- Delete quote repost button -->
							<div v-if="quote.authorID === $store.state.session.id" class="relative">
								<button
									class="focus:outline-none text-gray5 dark:text-gray3 ml-2"
									@click.stop="toggleDropdownQuoteDelete"
								>
									<More />
								</button>
								<div
									v-show="showQuoteDelete"
									class="border-lightBorder modal-animation absolute z-10 flex w-48 flex-col rounded-lg border bg-lightBG dark:bg-darkBG p-1 shadow-lg"
									:class="$colorMode.dark ? `dropdownDeleteOpenDark` : `dropdownDeleteOpen`"
									style="top: 35px; right: -10px"
								>
									<!-- Delete -->
									<button class="focus:outline-none text-negative flex" @click="deleteQuote">
										<BinIcon class="p-1" />
										<span class="text-negative self-center text-xs">Remove Quote from feed</span>
									</button>
								</div>
							</div>
						</div>
						<p class="my-2 break-words dark:text-darkPrimaryText">{{ this.quote.content }}</p>
					</div>
					<!-- Wrapper for rounded outline on quote repost -->
					<div v-if="!isDeleted" :class="quote ? `bg-lightBorder xl:dark:bg-darkInput rounded-lg p-4` : ``">
						<!-- Simple repost -->
						<div
							v-if="repostedBy !== `` && !hideRepostIcon && quote === null"
							class="text-gray5 dark:text-gray3 -mt-2 mb-3 flex w-full items-center pt-2"
						>
							<RepostIcon :shrink="true" />
							<p class="text-gray5 dark:text-gray3 pl-2 text-sm">
								<nuxt-link v-if="repostedBy != ``" :to="`/id/` + repostedBy">{{ repostedBy }} </nuxt-link>
								<nuxt-link v-else :to="`/id/` + repostedBy">{{ repostedBy }}</nuxt-link>
								reposted
							</p>
						</div>
						<!-- Top: avatar, name, id, close -->
						<div class="flex w-full justify-between">
							<div class="flex flex-row">
								<div @mouseover="triggerProfileCardTrue" @mouseleave="triggerProfileCardFalse">
									<Avatar
										:avatar="avatar"
										:authorID="post.authorID"
										size="w-12 h-12 transition ease-in-out hover:opacity-75"
									/>
								</div>
								<div class="ml-4 flex flex-grow flex-col">
									<CardProfileHeader
										:authorID="post.authorID"
										:authorName="authorName"
										@mouseover="triggerProfileCardTrue"
										@mouseleave="triggerProfileCardFalse"
									/>
									<!-- Timestamp and reading time -->
									<div class="flex flex-row mt-1 items-center">
										<span class="text-xs text-gray5 dark:text-gray3">
											{{ $formatDate(post.timestamp) }}
										</span>
										<div v-if="readingTime" class="h-1 w-1 rounded bg-gray5 dark:bg-gray3 mx-2"></div>
										<span v-if="readingTime" class="text-xs text-gray5 dark:text-gray3">
											{{ readingTime }} min read
										</span>
									</div>
								</div>
							</div>
							<div
								v-show="showProfileCard"
								class="border-lightBorder modal-animation-delay absolute z-40 flex w-72 flex-col rounded-lg border bg-lightBG dark:bg-darkBG p-4 shadow-lg"
								:style="quote ? `top: 185px` : repostedBy ? `top: 110px` : `top: 80px`"
								@mouseover="triggerProfileCardTrue"
								@mouseleave="showProfileCard = false"
							>
								<div class="w-full flex flex-row justify-between items-center mb-4">
									<Avatar :avatar="avatar" :authorID="post.authorID" size="w-16 h-16" />
									<FriendButton
										v-if="post.authorID !== $store.state.session.id && $route.name !== `id`"
										:small="true"
										:userIsFollowed="this.$route.name === `id-id` ? userIsFollowed : usersFollowing.has(post.authorID)"
										:toggleFriend="() => toggleFriend(post.authorID)"
									/>
								</div>
								<CardProfileHeader :authorID="post.authorID" :authorName="authorName" :isHoverCard="true" />
								<span v-if="authorBio !== ``" class="mt-2 dark:text-darkPrimaryText"> {{ authorBio }} </span>
							</div>
							<div class="relative flex items-center" :class="repostedBy !== `` ? `-mt-4` : ``">
								<!-- Bookmarks button -->
								<BookmarkButton :postID="postCID" :hasBookmark="isBookmarked" @clicked="getBookmarkStatus" />
								<button
									v-if="post.authorID === $store.state.session.id"
									class="focus:outline-none text-gray5 dark:text-gray3 ml-2"
									@click.stop="toggleDropdownDelete"
								>
									<More />
								</button>
								<div
									v-show="showDelete"
									class="dropdownDeleteOpen border-lightBorder modal-animation absolute z-10 flex w-36 flex-col rounded-lg border bg-lightBG dark:bg-darkBG p-1 shadow-lg"
									:class="$colorMode.dark ? `dropdownDeleteOpenDark` : `dropdownDeleteOpen`"
									:style="
										quote && quote.authorID === $store.state.session.id
											? `top: 55px; right: -10px`
											: `top: 45px; right: -10px`
									"
								>
									<!-- Delete -->
									<button class="focus:outline-none text-negative flex" @click="deletePost">
										<BinIcon class="p-1" />
										<span class="text-negative self-center text-xs">Remove from feed</span>
									</button>
								</div>
							</div>
						</div>
						<!-- Content -->
						<div class="mt-4 flex flex-col justify-between xl:flex-row">
							<!-- Left side: Title, subtitle / preview, tags -->
							<div class="mr-4 flex w-full flex-col justify-between">
								<nuxt-link :to="'/post/' + postCID">
									<div class="flex max-w-full flex-col overflow-hidden pr-4">
										<h3 class="break-words pb-2 text-lg font-semibold dark:text-darkPrimaryText">
											{{ post.title }}
										</h3>
										<h6
											v-if="(post.subtitle || post.excerpt) && featuredPhoto"
											class="max-w-420 break-words dark:text-darkSecondaryText"
										>
											{{ post.subtitle ? post.subtitle : postExcerpt() }}
										</h6>
										<h6
											v-if="(post.subtitle || post.excerpt) && !featuredPhoto"
											class="max-w-mobileCard xl:max-w-700 break-words text-lightSecondaryText dark:text-darkSecondaryText"
										>
											{{ post.subtitle ? post.subtitle : postExcerpt() }}
										</h6>
									</div>
								</nuxt-link>
								<!-- Display tags (Desktop) -->
								<div class="my-2 hidden overflow-x-auto xl:flex xl:flex-wrap text-lg">
									<TagPill v-for="t in post.tags" :key="t.name" :tag="t.name" class="my-2 mr-4" />
								</div>
								<!-- Actions buttons (Desktop) -->
								<div class="text-gray5 dark:text-gray3 mt-1 hidden xl:flex xl:items-center">
									<!-- Comment -->
									<button
										class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-secondary mr-4 hover:fill-primary flex items-center"
										:class="showComments ? `text-primary dark:text-secondary` : ``"
										@click="toggleComments"
									>
										<CommentIcon :isActive="showComments" />
										<span v-if="comments" class="ml-1 text-sm">{{ comments.length }}</span>
									</button>
									<!-- Repost popup -->
									<Repost
										:repost="repost"
										:post="post"
										:cid="postCID"
										class="mr-4 items-center"
										:hasRepost="hasReposted"
										:repostCount="repostCount"
										@toggleRepost="toggleQuoteRepost"
									/>
									<!-- Share popup button -->
									<button
										class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-secondary mr-4 hover:fill-primary flex items-center"
										:class="showShare ? `text-primary dark:text-secondary` : ``"
										style="margin-top: 2px"
										@click="showShare = !showShare"
									>
										<ShareIcon :isActive="showShare" />
										<p class="ml-1 text-sm">Share</p>
									</button>
									<button class="focus:outline-none" @click="toggleStatsCard"><StatsIcon /></button>
								</div>
							</div>
							<!-- Right side: Image -->
							<div v-if="featuredPhoto !== ``" class="mt-2 w-full flex-shrink-0 xl:mt-0 xl:w-56">
								<nuxt-link :to="'/post/' + postCID">
									<img :src="featuredPhoto" class="h-48 w-full flex-shrink-0 rounded-lg object-cover xl:h-32" />
								</nuxt-link>
							</div>
						</div>
						<!-- Display tags (Mobile) -->
						<div class="my-2 flex flex-wrap overflow-x-auto xl:hidden">
							<TagPill v-for="t in post.tags" :key="t.name" :tag="t.name" class="my-2 mr-4" />
						</div>
						<!-- Comment and share (Mobile) -->
						<div class="text-gray5 dark:text-gray3 mt-1 flex xl:hidden">
							<button
								class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-secondary mr-4 hover:fill-primary flex items-center"
								:class="showComments ? `text-primary dark:text-secondary` : ``"
								@click="toggleComments"
							>
								<CommentIcon :isActive="showComments" />
								<span v-if="comments" class="ml-1 text-sm">{{ comments.length }}</span>
							</button>
							<Repost
								:repost="repost"
								:post="post"
								:cid="postCID"
								class="fill-primary mr-4 items-center"
								:hasRepost="hasReposted"
								:repostCount="repostCount"
								@toggleRepost="toggleQuoteRepost"
							/>
							<!-- Share popup button -->
							<button
								class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-secondary mr-4 hover:fill-primary flex items-center"
								:class="showShare ? `text-primary dark:text-secondary` : ``"
								style="margin-top: 2px"
								@click="showShare = !showShare"
							>
								<ShareIcon :isActive="showShare" />
								<p class="ml-1 text-sm">Share</p>
							</button>
							<button class="focus:outline-none" @click="toggleStatsCard"><StatsIcon /></button>
						</div>
					</div>
					<div
						v-else
						:class="
							quote
								? `bg-lightBorder dark:bg-darkInput rounded-lg p-4 text-center text-gray5 dark:text-gray3 text-sm`
								: ``
						"
					>
						This post has been removed by the author
					</div>
				</div>
			</div>
		</div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import PostActions from '@/components/post/Actions.vue'
import Avatar from '@/components/Avatar.vue'
import BookmarkButton from '@/components/post/BookmarkButton.vue'
import CommentIcon from '@/components/icons/Comment.vue'
import ShareIcon from '@/components/icons/Share.vue'
import Repost from '@/components/post/Repost.vue'
import TagPill from '@/components/Tag.vue'
import More from '@/components/icons/More.vue'
import XIcon from '@/components/icons/X.vue'
import SendIcon from '@/components/icons/Send.vue'
import FriendButton from '@/components/FriendButton.vue'
import RepostIcon from '@/components/icons/Repost.vue'
import StatsIcon from '@/components/icons/Stats.vue'
import BinIcon from '@/components/icons/Bin.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import SharePopup from '@/components/popups/SharePopup.vue'
import CardProfileHeader from '@/components/post/card/ProfileHeader.vue'

import { RetrievedPost, getRegularPost } from '@/backend/post'
import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import { getProfileFromSession } from '@/store/session'
import { isPostBookmarkedByUser } from '@/backend/bookmarks'
import { sendPostDeletion } from '@/backend/postDeletion'
import { IRepost, sendRepost } from '@/backend/reposts'
import { ICommentData } from '@/backend/comment'
import { calculateReadingTime } from '@/backend/utilities/helpers'

interface IData {
	showComments: boolean
	showStats: boolean
	showDelete: boolean
	showQuoteDelete: boolean
	showQuoteCard: boolean
	showPopupCard: boolean
	showRepostEditor: boolean
	showProfileCard: boolean
	showPopup: boolean
	showShare: boolean
	authorName: string
	authorBio: string
	avatar: string
	myAvatar: string
	featuredPhoto: string
	isBookmarked: boolean
	isReposted: boolean
	repostOffset: number
	postDeleted: boolean
	hasEntered: boolean
	quoteContent: string
	quote: {
		authorID: string
		timestamp: number
		content: string
		avatar: string
		name: string
	} | null
	postCID: string
	readingTime: number | null
}

export default Vue.extend({
	name: `PostCard`,
	components: {
		PostActions,
		Avatar,
		BookmarkButton,
		CommentIcon,
		ShareIcon,
		TagPill,
		More,
		XIcon,
		BinIcon,
		Repost,
		StatsIcon,
		FriendButton,
		RepostIcon,
		BrandedButton,
		SendIcon,
		SharePopup,
		CardProfileHeader,
	},
	props: {
		repost: {
			type: Object as PropType<IRepost>,
			default: null,
		},
		post: {
			type: Object as PropType<RetrievedPost>,
			required: true,
		},
		repostedBy: {
			type: String,
			default: ``,
		},
		comments: {
			type: Array as PropType<ICommentData[] | undefined>,
			default: undefined,
		},
		profile: {
			type: Object as PropType<Profile>,
			default: null,
		},
		usersFollowing: {
			type: Set as PropType<Set<string>>,
			default: () => new Set(),
		},
		toggleFriend: {
			type: Function as PropType<(id: string) => void>,
			default: () => null,
		},
		hideRepostIcon: {
			type: Boolean,
			default: false,
		},
		bookmarked: {
			type: Boolean,
			default: false,
		},
		bookmarksCount: {
			type: Number,
			default: 0,
		},
		repostCount: {
			type: Number,
			default: 0,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		displayRepost: {
			type: Boolean,
			default: false,
		},
		// Only relevant on profile index page
		userIsFollowed: {
			type: Boolean,
			default: false,
		},
	},
	data(): IData {
		return {
			showComments: false,
			showStats: false,
			showDelete: false,
			showQuoteDelete: false,
			authorName: ``,
			authorBio: ``,
			avatar: ``,
			myAvatar: ``,
			featuredPhoto: ``,
			isBookmarked: false,
			isReposted: false,
			repostOffset: 0,
			postDeleted: false,
			showProfileCard: false,
			showQuoteCard: false,
			showPopupCard: false,
			hasEntered: false,
			showRepostEditor: false,
			showPopup: false,
			showShare: false,
			quote: null,
			postCID: ``,
			quoteContent: ``,
			readingTime: null,
		}
	},
	async created() {
		// Get post CID if on full post page
		if (this.post._id === undefined) {
			this.postCID = this.$route.params.post
		} else {
			this.postCID = this.post._id
		}
		// Populate author profile
		let profile = this.profile
		if (!profile) {
			if (this.$store.state.session.id === this.post.authorID) {
				// Viewing own post
				profile = getProfileFromSession(this.$store.state.session)
			} else {
				// Viewing someone else's post
				profile = createDefaultProfile(this.post.authorID)
				const fetchedProfile = await getProfile(this.post.authorID)
				if (fetchedProfile.profile) {
					profile = fetchedProfile.profile
				}
			}
		}
		this.isReposted = this.$store.getters.checkReposts(this.postCID)
		// Unauth
		if (this.$store.state.session.id === ``) {
			this.isReposted = false
		}
		// Populate Avatar
		this.authorName = profile.name
		if (profile.avatar && profile.avatar !== ``) {
			getPhotoFromIPFS(profile.avatar).then((p) => {
				this.avatar = p
			})
		}
		this.authorBio = profile.bio
		// Populate Featured Photo
		if (this.post.featuredPhotoCID) {
			getPhotoFromIPFS(this.post.featuredPhotoCID).then((p) => {
				this.featuredPhoto = p
			})
		}
		// Get bookmark status
		this.isBookmarked = this.bookmarked

		// Check if this is a repost
		if (this.repost && this.repost.type === `quote`) {
			this.getQuoteRepost(this.repost._id)
		}

		// Handle quote repost on full post page
		if (this.displayRepost) {
			// this.showPopup = true
			// this.showRepostEditor = true
			this.toggleQuoteRepost()
		}

		// Close pop-up event listener
		window.addEventListener(`click`, this.handleClose, false)
		window.addEventListener(
			`click`,
			(e: any): void => {
				if (!e.target) {
					return
				}
				if (
					e.target.parentNode === null ||
					e.target.parentNode.classList === undefined ||
					!e.target.parentNode.classList.contains(`toggle`)
				) {
					this.showQuoteDelete = false
					this.showDelete = false
				}
			},
			false,
		)
		this.calculateReadingTime()
	},
	destroyed() {
		window.removeEventListener(`click`, this.handleClose)
	},
	methods: {
		isPostBookmarkedByUser,
		getRegularPost,
		sendRepost,
		getProfile,
		async deletePost() {
			await sendPostDeletion(`HIDE`, this.postCID, this.$store.state.session.id)
			this.postDeleted = true
			this.$toastSuccess(`This post has been successfully removed`)
		},
		async deleteQuote() {
			await sendPostDeletion(`HIDE`, this.repost._id, this.$store.state.session.id)
			this.postDeleted = true
			this.$toastSuccess(`This quote has been successfully removed`)
		},
		async getBookmarkStatus() {
			this.isBookmarked = await isPostBookmarkedByUser(this.postCID, this.$store.state.session.id)
			this.$emit(`updateBookmarks`)
		},
		hasReposted(): boolean {
			return this.$store.state.session.id === this.repostedBy || this.$store.getters.checkReposts(this.postCID)
		},
		postExcerpt(): string {
			const excerpt = this.post.excerpt.slice(0, 177).trim()
			if (excerpt.endsWith(`...`)) {
				return excerpt
			}
			if (excerpt.endsWith(`..`)) {
				return excerpt + `.`
			}
			if (excerpt.endsWith(`.`)) {
				return excerpt + `..`
			}
			return excerpt + `...`
		},
		handleClose(e: any): void {
			if (!e.target || e.target.firstChild === null || e.target.firstChild.classList === undefined) {
				return
			}
			if (e.target.firstChild.classList[0] === `card`) {
				this.showComments = false
				this.showStats = false
				this.showRepostEditor = false
				this.showPopup = false
				this.showShare = false
				this.$emit(`closePopup`)
			}
		},
		handleCloseButton(): void {
			this.showComments = false
			this.showStats = false
			this.showRepostEditor = false
			this.showPopup = false
			this.$emit(`closePopup`)
		},
		toggleDropdownDelete() {
			this.showDelete = !this.showDelete
		},
		toggleDropdownQuoteDelete() {
			this.showQuoteDelete = !this.showQuoteDelete
		},
		async toggleQuoteRepost() {
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			if (this.$store.state.session.avatar) {
				this.myAvatar = await getPhotoFromIPFS(this.$store.state.session.avatar)
			}
			this.showPopup = true
			if (this.showRepostEditor) {
				this.showPopup = false
			}
			this.showRepostEditor = !this.showRepostEditor
		},
		toggleComments() {
			this.showComments = !this.showComments
			this.showPopup = true
		},
		toggleStatsCard() {
			this.showStats = !this.showStats
			this.showPopup = true
		},
		handleSendRepost() {
			if (this.quoteContent === ``) {
				return
			}
			const c = this.$refs.repostText as HTMLInputElement
			try {
				this.sendRepost(this.$store.state.session.id, this.postCID, c.value, `quote`)
				this.showComments = false
				this.showStats = false
				this.showRepostEditor = false
				this.showPopup = false
				this.$emit(`closePopup`)
				this.$toastSuccess(`Successfully quoted this post`)
			} catch (err: unknown) {
				this.$handleError(err)
			}
		},
		async getQuoteRepost(postCID: string) {
			const content = await this.getRegularPost(postCID)
			const { profile } = await this.getProfile(content.authorID)
			const q = {
				content: content.content,
				timestamp: content.timestamp,
				authorID: content.authorID,
				name: ``,
				avatar: ``,
				bio: ``,
			}
			if (profile) {
				q.name = profile.name
				q.bio = profile.bio
				if (profile.avatar && profile.avatar !== ``) {
					getPhotoFromIPFS(profile.avatar).then((p) => {
						q.avatar = p
					})
				}
			}
			this.quote = q
		},
		triggerProfileCardFalse() {
			setTimeout(() => {
				if (this.hasEntered !== true) {
					this.showProfileCard = false
					this.hasEntered = false
				}
			}, 70)
			this.hasEntered = false
		},
		triggerProfileCardTrue() {
			this.hasEntered = true
			this.showProfileCard = true
		},
		triggerQuoteCardFalse() {
			setTimeout(() => {
				if (this.hasEntered !== true) {
					this.showQuoteCard = false
					this.hasEntered = false
				}
			}, 70)
			this.hasEntered = false
		},
		triggerQuoteCardTrue() {
			this.hasEntered = true
			this.showQuoteCard = true
		},
		triggerPopupCardFalse() {
			setTimeout(() => {
				if (this.hasEntered !== true) {
					this.showPopupCard = false
					this.hasEntered = false
				}
			}, 70)
			this.hasEntered = false
		},
		triggerPopupCardTrue() {
			this.hasEntered = true
			this.showPopupCard = true
		},
		calculateReadingTime() {
			const readingTime = calculateReadingTime(this.post.wordCount, this.post.postImages?.length)
			if (!readingTime) {
				return
			}
			this.readingTime = readingTime
		},
	},
})
</script>
<style>
.dropdownDeleteOpen::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 0.8rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
}
.dropdownDeleteOpenDark::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 0.8rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #121212;
	border-radius: 2px;
}
</style>
