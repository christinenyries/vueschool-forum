<template>
  <div class="post-list">
    <div class="post" v-for="post in posts" :key="post.id">
      <div v-if="userById(post.userId)" class="user-info">
        <span class="user-name">{{ userById(post.userId).name }}</span>

        <span>
          <AppAvatarImg
            class="avatar-large"
            :src="userById(post.userId).avatar"
          />
        </span>

        <p class="desktop-only text-small">
          {{ userById(post.userId).postsCount }} posts
        </p>
        <p class="desktop-only text-small">
          {{ userById(post.userId).threadsCount }} threads
        </p>
      </div>

      <div class="post-content">
        <div class="col-full">
          <PostEditor
            v-if="editing === post.id"
            :post="post"
            @save="handleUpdate"
          />
          <p v-else>
            {{ post.text }}
          </p>
        </div>
        <a
          v-if="post.userId === $store.state.auth.authId"
          @click.prevent="toggleEditMode(post.id)"
          style="margin-left: auto; padding-left: 10px"
          class="link-unstyled"
          title="Make a change"
        >
          <fa icon="pencil-alt" />
        </a>
      </div>
      <div class="post-date text-faded">
        <div v-if="post.edited?.at" class="edition-info">edited</div>
        <app-date :timestamp="post.publishedAt" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import PostEditor from "./PostEditor.vue";
export default {
  components: {
    PostEditor,
  },
  props: {
    posts: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      editing: null,
    };
  },
  methods: {
    ...mapActions("posts", ["updatePost"]),
    handleUpdate(event) {
      this.updatePost(event.post);
      this.editing = null;
    },
    toggleEditMode(postId) {
      this.editing = postId === this.editing ? null : postId;
    },
    userById(userId) {
      return this.$store.getters["users/user"](userId);
    },
  },
};
</script>
