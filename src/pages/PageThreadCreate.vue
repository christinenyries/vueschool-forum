<template>
  <div v-if="ready" class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <thread-editor
      @save="save"
      @cancel="cancel"
      @dirty="formIsDirty = true"
      @clean="formIsDirty = false"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import { useRouter, onBeforeRouteLeave } from "vue-router";

import { findById } from "@/helpers";
import useAsyncDataStatus from "@/composables/useAsyncDataStatus";
import ThreadEditor from "@/components/ThreadEditor.vue";

const props = defineProps({
  forumId: {
    type: String,
    required: true,
  },
});

const store = useStore();
const router = useRouter();

const { ready, makeReady } = useAsyncDataStatus();
const formIsDirty = ref(false);

const forum = computed(() => findById(store.state.forums.items, props.forumId));

const cancel = () => {
  router.push({ name: "Forum", params: { id: forum.value.id } });
};
const save = async ({ title, text }) => {
  const thread = await store.dispatch("threads/createThread", {
    forumId: forum.value.id,
    text,
    title,
  });
  router.push({ name: "ThreadShow", params: { id: thread.id } });
};

(async () => {
  await store.dispatch("forums/fetchForum", { id: props.forumId });
  makeReady();
})();

onBeforeRouteLeave(() => {
  if (formIsDirty.value) {
    const confirmed = window.confirm(
      "Are you sure you want to leave? Unsaved changes will be lost!"
    );
    if (!confirmed) return false;
  }
});
</script>
