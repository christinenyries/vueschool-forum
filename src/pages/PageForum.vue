<template>
  <div v-if="asyncDataStatus_ready" class="col-full">
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

<script>
import ThreadList from "@/components/ThreadList.vue";
import { findById } from "@/helpers";
import { mapActions } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  components: {
    ThreadList,
  },
  mixins: [asyncDataStatus],
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      page: parseInt(this.$route.query.page) || 1,
      perPage: 10,
    };
  },
  computed: {
    forum() {
      return findById(this.$store.state.forums.items, this.id);
    },
    threads() {
      if (!this.forum || !this.forum.threads) return [];
      return this.forum.threads.reduce((threads, threadId) => {
        const thread = this.$store.getters["threads/thread"](threadId);
        if (thread) threads.push(thread);
        return threads;
      }, []);
    },
    threadCount() {
      return this.forum.threads?.length || 0;
    },
    totalPages() {
      return Math.ceil(this.threadCount / this.perPage);
    },
  },
  methods: {
    ...mapActions("forums", ["fetchForum"]),
    ...mapActions("threads", ["fetchThreadsByPage"]),
    ...mapActions("users", ["fetchUsers"]),
  },
  async created() {
    const forum = await this.fetchForum({ id: this.id });
    const threads = await this.fetchThreadsByPage({
      ids: forum.threads,
      page: this.page,
      perPage: this.perPage,
    });
    const userIds = threads.map((thread) => thread.userId);
    await this.fetchUsers({ ids: userIds });
    this.asyncDataStatus_fetched();
  },
  watch: {
    async page() {
      this.$router.push({ query: { page: this.page } });
    },
  },
};
</script>
