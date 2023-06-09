<template>
  <div v-if="ready" class="col-large push-top">
    <h1>
      {{ thread.title }}
      <router-link
        v-if="thread.userId == authUser?.id"
        :to="{ name: 'ThreadEdit', params: { id: thread.id } }"
      >
        <button class="btn-green btn-small">Edit Thread</button>
      </router-link>
    </h1>

    <p>
      By <span class="link-unstyled">{{ thread.author?.name }}</span
      >, <AppDate :timestamp="thread.publishedAt" />.
      <span
        style="float: right; margin-top: 2px"
        class="hide-mobile text-faded text-small"
        >{{ thread.repliesCount }}
        {{ thread.repliesCount > 1 ? "replies" : "reply" }} by
        {{ thread.contributorsCount }}
        {{
          thread.contributorsCount > 1 ? "contributors" : "contributor"
        }}</span
      >
    </p>

    <PostList :posts="threadPosts" />
    <PostEditor v-if="authUser" @save="addPost" />
    <div v-else class="text-center" style="margin-bottom: 50px">
      <RouterLink :to="{ name: 'SignIn', query: { redirectTo: $route.path } }"
        >Sign In</RouterLink
      >
      or
      <RouterLink :to="{ name: 'Register', query: { redirectTo: $route.path } }"
        >Register</RouterLink
      >
      to reply.
    </div>
  </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import difference from "lodash/difference";
import { useStore } from "vuex";

import useAsyncDataStatus from "@/composables/useAsyncDataStatus";
import useNotifications from "@/composables/useNotifications";

import PostList from "@/components/PostList.vue";
import PostEditor from "@/components/PostEditor.vue";

const props = defineProps({
  id: {
    required: true,
    type: String,
  },
});

const { ready, makeReady } = useAsyncDataStatus();
const { addNotification } = useNotifications();
const store = useStore();

const posts = computed(() => store.state.posts.items);
const authUser = computed(() => store.getters["auth/authUser"]);
const thread = computed(() => store.getters["threads/thread"](props.id));
const threadPosts = computed(() =>
  posts.value.filter((post) => post.threadId === props.id)
);

const addPost = (eventData) => {
  const post = {
    ...eventData.post,
    threadId: props.id,
  };
  store.dispatch("posts/createPost", post);
};
const fetchPostsWithUsers = async (ids) => {
  // fetch the posts in this thread
  const posts = await store.dispatch("posts/fetchPosts", {
    ids,
    onSnapshotCallback: ({ isLocal, previousItem }) => {
      if (
        !ready.value ||
        isLocal ||
        (previousItem?.edited && !previousItem.edited?.at)
      ) {
        return;
      }
      addNotification({
        message: "Thread recently updated",
        timeout: 5000,
      });
    },
  });

  // fetch the thread's user
  // fetch the users of these posts
  const userIds = posts.map((post) => post.userId).concat(thread.value.userId);
  await store.dispatch("users/fetchUsers", {
    ids: userIds,
  });
};

(async () => {
  const thread = await store.dispatch("threads/fetchThread", {
    id: props.id,
    onSnapshotCallback: async ({ isLocal, item, previousItem }) => {
      if (!ready.value || isLocal) return;
      const newPosts = difference(item.posts, previousItem.posts);
      const hasNewPosts = newPosts.length > 0;
      if (hasNewPosts) {
        await fetchPostsWithUsers(newPosts);
      } else {
        addNotification({
          message: "Thread recently updated",
          timeout: 5000,
        });
      }
    },
  });
  await fetchPostsWithUsers(thread.posts);
  makeReady();
})();
</script>

<style>
.post-list {
  margin-top: 20px;
}

.post {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: white;
  padding: 20px 10px;
  padding-bottom: 7px;
  box-shadow: 2px 2px 1px rgba(136, 136, 136, 0.09);
  margin-bottom: 20px;
}

@media (max-width: 820px) {
  .post {
    padding: 0;
  }
}

.post .user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  flex: 1 1 15%;
  margin-right: 5px;
}

.post .user-info > * {
  margin-bottom: 10px;
}

@media (max-width: 820px) {
  .post .user-info {
    order: -2;
    flex-direction: row;
    justify-content: flex-start;
    background: rgba(73, 89, 96, 0.06);
    margin-right: 0;
    padding: 5px;
    padding-left: 10px;
  }

  .post .user-info .avatar-large {
    height: 35px;
    width: 35px;
    margin-right: 5px;
    order: 1;
  }

  .post .user-info .user-name {
    order: 2;
  }

  .post .user-info > * {
    margin-right: 5px;
    margin-bottom: 0;
  }
}

.post .post-date {
  flex-basis: 100%;
  font-size: 14px;
  text-align: right;
  margin-bottom: 5px;
  padding-right: 7px;
}

@media (max-width: 820px) {
  .post .post-date {
    order: -1;
    flex-basis: 40%;
    background: rgba(73, 89, 96, 0.06);
    padding-right: 10px;
    padding-top: 16px;
    margin-bottom: 0px;
  }
}

@media (max-width: 720px) {
  .post {
    padding: 0px;
  }
}

.post-content {
  display: flex;
  flex: 1 0 83%;
  padding-left: 15px;
  padding-right: 10px;
  font-size: 16px;
  text-align: justify;
  line-height: 1.5;
  word-break: break-word;
}

.post-content h1,
.post-content h2,
.post-content h3 {
  margin-bottom: 0;
}

.post-content p {
  margin-bottom: 20px;
}

.post-content pre {
  display: grid;
  overflow: auto;
  word-wrap: break-word;
  border-radius: 3px;
  padding: 10px;
}

.post-content blockquote {
  margin: 25px 0px;
}

.post-content blockquote.big {
  display: flex;
  position: relative;
}

.post-content blockquote.big::before {
  position: absolute;
  top: -25px;
  left: -25px;
  font-size: 42px;
  font-family: FontAwesome;
  content: "\f10e";
  color: #263959;
}

@media (max-width: 820px) {
  .post-content blockquote.big::before {
    top: -15px;
    left: -18px;
    font-size: 32px;
  }
}

.post-content blockquote.big .quote {
  padding-left: 20px;
  padding-right: 15px;
  flex-basis: 95%;
  font-weight: 100;
  font-style: italic;
  font-size: 17px;
}

.post-content blockquote.big .author {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
}

.post-content blockquote.big .author img {
  flex: 1;
  flex-basis: 100%;
  margin-top: 10px;
  width: 80px;
  height: 80px;
}

.post-content blockquote.small {
  display: flex;
  position: relative;
  flex-direction: column;
  border: 2px solid rgba(152, 152, 152, 0.15);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.post-content blockquote.small::before {
  position: absolute;
  top: -20px;
  left: -20px;
  font-size: 42px;
  font-family: FontAwesome;
  content: "\f10e";
  color: #263959;
}

@media (max-width: 820px) {
  .post-content blockquote.small::before {
    top: -18px;
    left: -15px;
    font-size: 32px;
  }
}

.post-content blockquote.small .author {
  display: flex;
  flex-basis: 100%;
  padding: 3px 10px 3px 28px;
  background-color: rgba(152, 152, 152, 0.15);
  justify-content: center;
  align-items: center;
}

.post-content blockquote.small .author .time {
  margin-left: 10px;
}

.post-content blockquote.small .author .fa {
  margin-left: auto;
  font-size: 20px;
}

.post-content blockquote.small .author .fa:hover {
  cursor: pointer;
}

.post-content blockquote.small .quote {
  display: flex;
  flex-basis: 100%;
  flex-direction: column;
  padding: 10px;
  font-weight: 100;
  font-style: italic;
  font-size: 17px;
}

.post-content blockquote.simple {
  position: relative;
  padding: 0px 10px 0px 20px;
  font-weight: 100;
  font-style: italic;
  font-size: 17px;
  letter-spacing: 0.15px;
}

.post-content blockquote.simple::before {
  position: absolute;
  top: -25px;
  left: -25px;
  font-size: 42px;
  font-family: FontAwesome;
  content: "\f10e";
  color: #263959;
}

@media (max-width: 820px) {
  .post-content blockquote.simple::before {
    top: -15px;
    left: -18px;
    font-size: 32px;
  }
}

.post-content blockquote.simple .author {
  display: block;
  margin-top: 10px;
  font-weight: normal;
}

.post-content blockquote.simple .author .time {
  margin-left: 10px;
}

.post-listing-editor {
  flex: 1 1 83%;
}
</style>
