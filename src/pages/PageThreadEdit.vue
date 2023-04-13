<template>
  <div v-if="ready" class="col-full push-top">
    <h1>
      Editing <i>{{ thread.title }}</i>
    </h1>

    <thread-editor
      :title="thread.title"
      :text="text"
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
  id: {
    type: String,
    required: true,
  },
});

const store = useStore();
const router = useRouter();

const { ready, makeReady } = useAsyncDataStatus();
const formIsDirty = ref(false);

const thread = computed(() => findById(store.state.threads.items, props.id));
const text = computed(
  () => findById(store.state.posts.items, thread.value.posts[0]).text
);

const cancel = () =>
  router.push({ name: "ThreadShow", params: { id: props.id } });
const save = async ({ title, text }) => {
  const thread = await store.dispatch("threads/updateThread", {
    id: props.id,
    text,
    title,
  });
  router.push({ name: "ThreadShow", params: { id: thread.id } });
};

(async () => {
  const thread = await store.dispatch("threads/fetchThread", { id: props.id });
  await store.dispatch("posts/fetchPost", { id: thread.posts[0] });
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
