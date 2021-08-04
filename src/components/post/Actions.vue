<template>
	<section>
		<!-- Post a Comment -->
		<article class="py-5">
			<div class="flex items-start">
				<!-- Profile Photo / Avatar -->
				<span v-if="this.myAvatar === '' || this.myAvatar === null" class="p-1 border-2 rounded-full mt-1">
					<ProfileIcon class="w-6 h-6" />
				</span>
				<img v-else :src="this.myAvatar" class="w-10 h-10 rounded-lg object-cover mt-1" />
				<!-- Comment box Container -->
				<div
					class="comment-container flex bg-white shadow-xl rounded-xl p-3 ml-5 w-full overflow-hidden"
					:style="{ backgroundImage: `url(${this.$store.state.config.backgrounds[this.emotionCategory]})` }"
				>
					<div
						class="flip-container relative border shadow-inner rounded-xl overflow-hidden w-full h-40"
						:class="this.showEmotions ? 'flip' : ''"
					>
						<div class="flipper flex flex-row absolute">
							<!-- Front side: Type comment -->
							<div class="front w-full flex bg-white">
								<div class="self-center">
									<button @click="showEmotions = !showEmotions">
										<img v-if="this.emotion !== ''" :src="this.emotion.image" class="h-16 w-16 object-center" />
										<span v-else>Flip</span>
									</button>
								</div>
								<textarea
									v-model="comment"
									class="leading-normal resize-none overflow-y-auto w-full h-40 pl-2 pt-1 pr-16 focus:outline-none"
									name="body"
									placeholder="Write a Comment..."
								/>
								<div class="relative">
									<span class="absolute bottom-0 right-0 flex flex-col">
										<BrandedButton
											text="Post"
											:action="sendComment"
											:thin="true"
											class="text-sm mb-3 mr-1"
											:class="this.comment !== '' ? '' : 'opacity-50'"
										/>
									</span>
								</div>
							</div>
							<!-- Back side: Choose reaction -->
							<div class="back flex w-full h-40">
								<!-- Left side: Category of emotion -->
								<div class="w-40 flex flex-col bg-white">
									<button
										class="focus:outline-none text-left pl-4 py-1 rounded-lg mt-2 ml-2"
										:class="this.emotionCategory === `positive` ? `bg-transparent -mr-2` : `mr-2`"
										:style="{ backgroundImage: `url(${$store.state.config.backgrounds.positive})` }"
										@click="setEmotionCategory(`positive`)"
									>
										Positive
									</button>
									<button
										class="focus:outline-none text-left pl-4 py-1 rounded-lg mt-2 ml-2"
										:class="this.emotionCategory === `negative` ? `bg-transparent -mr-2` : `mr-2`"
										:style="{ backgroundImage: `url(${$store.state.config.backgrounds.negative})` }"
										@click="setEmotionCategory(`negative`)"
									>
										Negative
									</button>
									<button
										class="focus:outline-none text-left pl-4 py-1 rounded-lg mt-2 ml-2"
										:class="this.emotionCategory === `neutral` ? `bg-transparent -mr-2` : `mr-2`"
										:style="{ backgroundImage: `url(${$store.state.config.backgrounds.neutral})` }"
										@click="setEmotionCategory(`neutral`)"
									>
										Neutral
									</button>
								</div>
								<!-- Right side: -->
								<div class="overflow-auto grid grid-cols-3 w-full -mr-1">
									<button
										v-for="e in this.categories[this.emotionCategory]"
										:key="e"
										class="w-full items-center focus:outline-none"
										@click="setEmotion($store.state.config.reactions[e])"
									>
										<img
											:src="$store.state.config.reactions[e].image"
											:alt="$store.state.config.reactions[e].label"
											class="flex-shrink-0 h-20 w-20"
										/>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</article>
		<article>
			<CommentCard v-for="c in this.filterComments()" :key="c.id" class="py-2" :comment="c" />
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import { Comment } from '@/interfaces/Comment'
import BrandedButton from '@/components/BrandedButton.vue'
import ProfileIcon from '@/components/icons/Person.vue'
import CommentCard from '@/components/post/Comment.vue'

export default Vue.extend({
	name: `ComponentPostActions`,
	components: {
		BrandedButton,
		ProfileIcon,
		CommentCard,
	},
	props: {
		post: {
			type: Object,
			default: null,
		},
		filter: {
			type: String,
			default: null,
		},
	},
	data() {
		const comments: Comment[] = []
		return {
			comment: ``,
			comments,
			emotion: ``,
			emotionCategory: `positive`,
			myAvatar: ``,
			showEmotions: true,
			commentBackground: `@/assets/images/brand/paper4.svg`,
			categories: {
				positive: [`awe`, `excited`, `happy`, `lol`, `proud`, `touched`],
				negative: [`sad`, `sick`, `terrified`, `skeptical`, `drama`],
				neutral: [`goofy`],
			},
		}
	},
	created() {
		if (this.$store.state.session.avatar !== ``) {
			this.$getPhoto(this.$store.state.session.avatar).then((image) => {
				this.myAvatar = image
			})
		}
	},
	methods: {
		setEmotion(r) {
			this.emotion = r
			this.showEmotions = false
		},
		setEmotionCategory(c) {
			this.emotionCategory = c
		},
		sendComment() {
			if (this.comment === `` || !this.$qualityText(this.comment)) {
				alert(`invalid comment!`)
			} else {
				const c: Comment = {
					postID: this.post.id,
					authorCID: this.$store.state.session.cid,
					authorAvatarCID: this.$store.state.session.avatar,
					content: this.comment,
					emotion: this.emotion,
					timestamp: new Date(),
					replies: [],
				}
				this.$props.post.comments.push(c)
				this.filterComments()
				this.comment = ``
				this.emotion = ``
			}
		},
		handleReaction(reaction) {
			this.emotion = reaction
		},
		filterComments() {
			let cList: Comment[] = []
			if (this.$props.filter === null) {
				cList = this.$props.post.comments
			} else {
				for (const c in this.$props.post.comments) {
					if (this.$props.post.comments[c].emotion === this.$props.filter) {
						cList.push(this.$props.post.comments[c])
					}
				}
			}
			if (!cList) {
				return this.$props.post.comments
			}
			cList = cList.slice().sort((p0, p1) => {
				return p1.timestamp.getTime() - p0.timestamp.getTime()
			})
			return cList
		},
	},
})
</script>

<style>
/* entire container, keeps perspective */
.flip-container {
	perspective: 1000px;
}
.flip-container.flip .flipper {
	transform: rotateY(180deg);
}

/* flip speed goes here */
.flipper {
	transition: 0.6s;
	transform-style: preserve-3d;
	position: relative;
}

/* hide back of pane during swap */
.front,
.back {
	backface-visibility: hidden;
	position: absolute;
	top: 0;
	left: 0;
}

/* front pane, placed above back */
.front {
	z-index: 2;
	/* for firefox 31 */
	transform: rotateY(0deg);
}

/* back, initially hidden pane */
.back {
	transform: rotateY(180deg);
}
.comment-container {
	background: no-repeat;
	-webkit-background-size: cover;
	-moz-background-size: cover;
	-o-background-size: cover;
	background-size: cover;
}
</style>
