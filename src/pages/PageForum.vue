<template>
  <div v-if="ready" class="col-full">
    <div class="col-full push-top">
      <AppHead>
        <title>{{ forum?.name }}</title>
        <meta property="og:title" :content="forum?.name" />
        <meta name="twitter:title" :content="forum?.name" />
      </AppHead>
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{ forum.name }}</h1>
          <p class="text-lead">{{ forum.description }}</p>
        </div>
        <router-link
          :to="{ name: 'ThreadCreate', params: { forumId: forum.id } }"
          class="btn-green btn-small"
          >Start a thread</router-link
        >
      </div>
    </div>

    <div class="col-full push-top">
      <thread-list :threads="threads" />
      <VPagination
        v-model="page"
        :pages="totalPages"
        :range-size="3"
        active-color="#57AD8D"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

import { findById } from "@/helpers";
import useAsyncDataStatus from "@/composables/useAsyncDataStatus";
import ThreadList from "@/components/ThreadList.vue";

const props = defineProps({
  id: {
    required: true,
    type: String,
  },
});

const store = useStore();
const router = useRouter();
const route = useRoute();
const { ready, makeReady } = useAsyncDataStatus();

const page = ref(parseInt(route.query.page) || 1);
const perPage = 10;

const forum = computed(() => findById(store.state.forums.items, props.id));
const threads = computed(() => {
  if (!forum.value || !forum.value.threads) return [];
  return forum.value.threads.reduce((threads, threadId) => {
    const thread = store.getters["threads/thread"](threadId);
    if (thread) threads.push(thread);
    return threads;
  }, []);
});
const threadCount = computed(() => forum.value.threads?.length || 0);
const totalPages = computed(() => Math.ceil(threadCount.value / perPage));

watch(page, () => router.push({ query: { page: page.value } }));

(async () => {
  const forum = await store.dispatch("forums/fetchForum", { id: props.id });
  const threads = await store.dispatch("threads/fetchThreadsByPage", {
    ids: forum.threads,
    page: page.value,
    perPage: perPage,
  });
  const userIds = threads.map((thread) => thread.userId);
  await store.dispatch("users/fetchUsers", { ids: userIds });
  makeReady();
})();
</script>
