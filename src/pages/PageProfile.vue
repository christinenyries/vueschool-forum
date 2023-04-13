<template>
  <div v-if="ready && user" class="container" style="width: 100%">
    <div class="flex-grid">
      <div class="col-3 push-top">
        <UserProfileCard v-if="!edit" :user="user" />
        <UserProfileCardEditor v-else :user="user" />
      </div>

      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead"> {{ user.username }}'s recent activity </span>
        </div>
        <hr />
        <PostList :posts="user.posts" />
        <AppInfiniteScroll
          @load="fetchAuthUserPosts"
          :done="user.posts.length === user.postsCount"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";

import { useStore } from "vuex";
import useAsyncDataStatus from "@/composables/useAsyncDataStatus";

import PostList from "@/components/PostList.vue";
import UserProfileCard from "@/components/UserProfileCard.vue";
import UserProfileCardEditor from "@/components/UserProfileCardEditor.vue";

defineProps({
  edit: {
    type: Boolean,
    default: false,
  },
});

const store = useStore();
const { ready, makeReady } = useAsyncDataStatus();
const user = computed(() => store.getters["auth/authUser"]);
const lastPostFetched = computed(() => {
  if (user.value.posts.length === 0) return null;
  return user.value.posts[user.value.posts.length - 1];
});

const fetchAuthUserPosts = async () =>
  await store.dispatch("auth/fetchAuthUserPosts", {
    lastPostFetched: lastPostFetched.value,
  });

(async () => {
  await fetchAuthUserPosts();
  makeReady();
})();
</script>
