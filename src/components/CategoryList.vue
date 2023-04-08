<template>
  <div class="col-full">
    <category-item
      v-for="category in categories"
      :key="category.id"
      :category="category"
    />
  </div>
</template>

<script>
import CategoryItem from "./CategoryItem.vue";
export default {
  props: {
    categories: {
      required: true,
      type: Array,
    },
  },
  components: {
    CategoryItem,
  },
};
</script>
