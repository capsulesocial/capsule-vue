<template>
  <section>
    <!-- Post a Comment -->
    <article class="py-5">
      <div class="flex items-start">
        <!-- Profile Photo / Avatar -->
        <img
          v-if="this.myAvatar !== ''"
          :src="this.myAvatar"
          class="w-10 h-10 rounded-lg object-cover mt-1"
        />
        <span v-else class="p-1 border-2 rounded-full mt-1">
          <ProfileIcon class="w-6 h-6" />
        </span>
        <!-- Comment box Container -->
        <div class="flex bg-white shadow-xl rounded-xl p-3 ml-5 w-full relative overflow-hidden">
          <!-- Background image -->
          <div class="absolute flex flex-row -mt-3 -ml-3 w-full">
            <img
              v-if="this.emotion !== ''"
              :src="require('@/assets/images/backgrounds/' + this.emotion.toLowerCase() + '.png')"
              class="w-full"
            />
            <span v-else class="flex flex-row">
              <img :src="require('@/assets/images/backgrounds/paper.png')" />
              <img :src="require('@/assets/images/backgrounds/paper.png')" />
              <img :src="require('@/assets/images/backgrounds/paper.png')" />
            </span>
          </div>
          <div class="flip-container relative border-2 shadow-inner rounded-xl overflow-hidden w-full h-24" :class="this.showEmotions ? 'flip' : ''">
            <div class="flipper flex flex-row absolute">
              <!-- Type comment -->
              <div class="front w-full">
                <textarea
                  v-model="comment"
                  class="leading-normal resize-none overflow-y-auto w-full h-24 pl-2 pt-1 pr-16 focus:outline-none"
                  name="body"
                  placeholder="Write a Comment..."
                />
                <div class="relative">
                  <span class="absolute bottom-0 right-0 flex flex-col">
                    <button class="mb-4" @click="showEmotions = !showEmotions">Flip</button>
                    <BrandedButton
                      text="Post"
                      :action="sendComment"
                      :thin="true"
                      class="text-sm mb-4 mr-2"
                      :class="this.comment !== '' ? '' : 'opacity-50'"
                    />
                  </span>
                </div>
              </div>
              <div class="back w-full px-1 bg-white h-24">
                <!-- Select Reaction -->
                <p class="text-sm text-gray4 italic">
                  What's your response?
                </p>
                <button @click="showEmotions = !showEmotions">
                  Flip
                </button>
                <button v-for="r in this.$store.state.config.reactions" :key="r.label" @click="setEmotion(r)">
                  {{ r.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
    <article>
      <CommentCard
        v-for="c in this.filterComments()"
        :key="c.id"
        class="py-2"
        :comment="c"
      />
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
  data () {
    let comments: Comment[] = []
    return {
      comment: '',
      comments,
      emotion: '',
      myAvatar: '',
      showEmotions: false,
      commentBackground: '@/assets/images/brand/paper4.svg',
    }
  },
  created () {
    if (this.$store.state.session.avatar !== '') {
      this.$getPhoto(this.$store.state.session.avatar).then((image) => {
        this.myAvatar = image
      })
    }
  },
  methods: {
    setEmotion (r) {
      this.emotion = r.label
      this.showEmotions = false
    },
    sendComment () {
      // Check comment quality
      if (this.comment === '' || !this.$qualityText(this.comment)) {
        alert('invalid comment!')
      } else {
        const c:Comment = {
          postID: this.post.id,
          authorCID: this.$store.state.session.cid,
          authorAvatarCID: this.$store.state.session.avatar,
          content: this.comment,
          emotion: this.emotion,
          timestamp: new Date(),
          replies: [],
        }
        // this.$store.commit('posts/postComment', c)
        this.$props.post.comments.push(c)
        this.filterComments()
        this.comment = ''
        this.emotion = ''
      }
    },
    handleReaction (reaction) {
      this.emotion = reaction
    },
    filterComments () {
      let cList: Comment[] = []
      if (this.$props.filter === null) {
        cList = this.$props.post.comments
      } else {
        for (const c in this.$props.comments) {
          if (this.$props.post.comments[c].emotion === this.$props.filter) {
            cList.push(this.$props.post.comments[c])
          }
        }
      }
      if (!cList) return this.$props.post.comments
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
.front, .back {
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

</style>
