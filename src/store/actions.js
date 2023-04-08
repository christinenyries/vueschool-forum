import { db } from "@/firebase";
import { findById } from "@/helpers";
import { onSnapshot, doc } from "firebase/firestore";

export default {
  fetchItem(
    { commit, state },
    {
      id,
      resource,
      handleUnsubscribe = null,
      once = false,
      onSnapshotCallback = null,
    }
  ) {
    return new Promise((resolve) => {
      const unsubscribe = onSnapshot(doc(db, resource, id), (doc) => {
        if (once) {
          unsubscribe();
        }
        if (doc.exists()) {
          const item = { id: doc.id, ...doc.data() };
          let previousItem = findById(state[resource].items, id);
          previousItem = previousItem ? { ...previousItem } : null;
          commit("setItem", { resource, item });
          if (typeof onSnapshotCallback === "function") {
            const isLocal = doc.metadata.hasPendingWrites;
            onSnapshotCallback({ item: { ...item }, previousItem, isLocal });
          }
          resolve(item);
        } else {
          resolve(null);
        }
      });
      if (handleUnsubscribe) {
        handleUnsubscribe(unsubscribe);
      } else {
        commit("appendUnsubscribe", { unsubscribe });
      }
    });
  },
  fetchItems(
    { dispatch },
    { ids, resource, emoji, onSnapshotCallback = null }
  ) {
    ids = ids || [];
    return Promise.all(
      ids.map((id) =>
        dispatch("fetchItem", { id, resource, emoji, onSnapshotCallback })
      )
    );
  },
  async unsubscribeAllSnapshots({ state, commit }) {
    state.unsubscribes.forEach((unsubscribe) => unsubscribe());
    commit("clearAllUnsubscribes");
  },
  clearItems({ commit }, { modules = [] }) {
    commit("clearItems", { modules });
  },
};
