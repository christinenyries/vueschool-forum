<template>
  <div v-if="ready" class="container col-full">
    <h1 v-if="category">{{ category.name }}</h1>
    <category-item :category="category" />
  </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";

import useAsyncDataStatus from "@/composables/useAsyncDataStatus";
import { findById } from "@/helpers";
import CategoryItem from "@/components/CategoryItem.vue";

const props = defineProps({
  id: {
    required: true,
    type: String,
  },
});

const store = useStore();
const { ready, makeReady } = useAsyncDataStatus();
const category = computed(() =>
  findById(store.state.categories.items, props.id)
);

(async () => {
  const category = await store.dispatch("categories/fetchCategory", {
    id: props.id,
  });
  store.dispatch("forums/fetchForums", { ids: category.forums });
  makeReady();
})();
</script>
