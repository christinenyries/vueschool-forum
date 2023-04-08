<template>
  <div
    v-if="asyncDataStatus_ready && user"
    class="container"
    style="width: 100%"
  >
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

<script>
import PostList from "@/components/PostList.vue";
import UserProfileCard from "@/components/UserProfileCard.vue";
import UserProfileCardEditor from "@/components/UserProfileCardEditor.vue";
import { mapGetters } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  components: {
    PostList,
    UserProfileCard,
    UserProfileCardEditor,
  },
  mixins: [asyncDataStatus],
  props: {
    edit: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters("auth", { user: "authUser" }),
    lastPostFetched() {
      if (this.user.posts.length === 0) return null;
      return this.user.posts[this.user.posts.length - 1];
    },
  },
  methods: {
    async fetchAuthUserPosts() {
      await this.$store.dispatch("auth/fetchAuthUserPosts", {
        lastPostFetched: this.lastPostFetched,
      });
    },
  },
  async created() {
    await this.fetchAuthUserPosts();
    this.asyncDataStatus_fetched();
  },
};
</script>
