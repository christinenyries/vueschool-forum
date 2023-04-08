import {
  makeAppendChildToParentMutation,
  makeFetchItemAction,
  makeFetchItemsAction,
} from "@/helpers";

export default {
  namespaced: true,
  state: {
    items: [],
  },
  actions: {
    fetchForum: makeFetchItemAction({ emoji: "🏁", resource: "forums" }),
    fetchForums: makeFetchItemsAction({ emoji: "🏁", resource: "forums" }),
  },
  mutations: {
    appendThreadToForum: makeAppendChildToParentMutation({
      parent: "forums",
      child: "threads",
    }),
  },
};
