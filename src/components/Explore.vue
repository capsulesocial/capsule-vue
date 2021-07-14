<template>
  <aside>
    <div>
      <h3 class="text-2xl underline italic p-2">
        Trending Tags
      </h3>
      <TagCard
        v-for="t in this.$store.state.tags"
        :key="t.tag"
        :tag="t.tag"
      />
    </div>
  </aside>
</template>

<script>
import TagCard from '@/components/Tag.vue'

export default {
	components: {
		TagCard,
	},
}
</script>
