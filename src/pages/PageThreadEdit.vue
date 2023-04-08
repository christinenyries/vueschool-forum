<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
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

<script>
import ThreadEditor from "@/components/ThreadEditor.vue";
import { findById } from "@/helpers";
import { mapActions } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  components: { ThreadEditor },
  mixins: [asyncDataStatus],
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      formIsDirty: false,
    };
  },
  computed: {
    thread() {
      return findById(this.$store.state.threads.items, this.id);
    },
    text() {
      return findById(this.$store.state.posts.items, this.thread.posts[0]).text;
    },
  },
  methods: {
    ...mapActions("threads", ["updateThread", "fetchThread", "fetchPost"]),
    ...mapActions("posts", ["fetchPost"]),
    cancel() {
      this.$router.push({ name: "ThreadShow", params: { id: this.id } });
    },
    async save({ title, text }) {
      const thread = await this.updateThread({
        id: this.id,
        text,
        title,
      });
      this.$router.push({ name: "ThreadShow", params: { id: thread.id } });
    },
  },
  async created() {
    const thread = await this.fetchThread({ id: this.id });
    await this.fetchPost({ id: thread.posts[0] });
    this.asyncDataStatus_fetched();
  },
  beforeRouteLeave() {
    if (this.formIsDirty) {
      const confirmed = window.confirm(
        "Are you sure you want to leave? Unsaved changes will be lost!"
      );
      if (!confirmed) return false;
    }
  },
};
</script>
