import { defineStore } from "pinia";
import sourceData from "@/data.json";
import { useThreadsStore } from "./ThreadsStore";
export const usePostsStore = defineStore("PostsStore", {
  state: () => {
    return {
      posts: sourceData.posts,
    };
  },
  getters: {},
  actions: {
    createPost(post) {
      post.id = "gggg" + Math.random();
      this.posts.push(post);
      const thread = findById(useThreadsStore().threads, post.threadId);
      thread.posts.push(post.id);
    },
  },
});
