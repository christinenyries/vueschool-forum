<template>
  <div v-if="category" class="col-full">
    <div class="category-item" :key="category.id">
      <div class="forum-list">
        <h2 class="list-title">
          <router-link
            :to="{ name: 'Category', params: { id: category.id } }"
            >{{ category.name }}</router-link
          >
        </h2>

        <forum-list :forums="forumsByCategoryId(category.id)" />
      </div>
    </div>
  </div>
</template>

<script>
import ForumList from "./ForumList.vue";
export default {
  props: {
    category: {
      required: true,
      type: Object,
    },
  },
  components: {
    ForumList,
  },
  methods: {
    forumsByCategoryId(categoryId) {
      return this.$store.state.forums.items.filter(
        (forum) => forum.categoryId === categoryId
      );
    },
  },
};
</script>
