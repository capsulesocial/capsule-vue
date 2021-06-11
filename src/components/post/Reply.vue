<template>
  <div class="flex">
    <div class="flex-shrink-0">
      <img
        v-if="reply.authorAvatarCID !== null"
        :src="this.avatar"
        class="w-10 h-10 rounded-lg object-cover"
      />
      <span v-else class="p-1 border-2 rounded-full block">
        <ProfileIcon class="w-6 h-6" />
      </span>
    </div>
    <div class="flex-1 leading-relaxed ml-2">
      <strong class="text-black font-bold bold mr-1">
        {{ getFullName(reply.authorID) }}
      </strong>
      <span class="text-gray-700 text-sm mr-2">
        @{{ reply.authorID }}
      </span>
      <span v-if="reply.timestamp" class="text-gray-600 text-xs font-sans">
        {{ $helpers.formatDate(reply.timestamp) }}
      </span>
      <p class="text-sm py-1 font-sans">
        {{ reply.content }}
      </p>
    </div>
  </div>
</template>

<script>
import ProfileIcon from '@/components/icons/Person'

export default {
  components: {
    ProfileIcon,
  },
  props: {
    reply: {
      type: Object,
      default: null,
    },
  },
  data () {
    return {
      avatar: null,
    }
  },
  created () {
    if (this.$props.reply.authorAvatarCID !== null) {
      this.$api.settings.downloadAvatar(this.$props.reply.authorAvatarCID).then((image) => {
        this.avatar = image
      })
    }
  },
  methods: {
    getFullName (id) {
      if (this.$store.state.me.id === id) {
        return this.$store.state.me.username
      }
      const list = this.$store.state.authors
      const name = list.find(x => x.id === id)
      if (name) {
        return name.username
      } else {
        return id
      }
    },
  },
}
</script>
