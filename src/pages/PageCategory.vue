<template>
  <div v-if="asyncDataStatus_ready" class="container col-full">
    <h1 v-if="category">{{ category.name }}</h1>
    <category-item :category="category" />
  </div>
</template>

<script>
import CategoryItem from "@/components/CategoryItem.vue";
import { findById } from "@/helpers";
import { mapActions } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  components: {
    CategoryItem,
  },
  mixins: [asyncDataStatus],
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  computed: {
    category() {
      return findById(this.$store.state.categories.items, this.id);
    },
  },
  methods: {
    ...mapActions("categories", ["fetchCategory"]),
    ...mapActions("forums", ["fetchForums"]),
  },
  async created() {
    const category = await this.fetchCategory({
      id: this.id,
    });
    await this.fetchForums({ ids: category.forums });
    this.asyncDataStatus_fetched();
  },
};
</script>
