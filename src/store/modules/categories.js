import { db } from "@/firebase";
import { makeFetchItemAction } from "@/helpers";
import { collection, query, onSnapshot } from "firebase/firestore";

export default {
  namespaced: true,
  state: {
    items: [],
  },
  actions: {
    fetchCategory: makeFetchItemAction({ emoji: "🏷", resource: "categories" }),
    fetchAllCategories({ commit }) {
      return new Promise((resolve) => {
        const q = query(collection(db, "categories"));
        onSnapshot(q, (querySnapshot) => {
          const categories = querySnapshot.docs.map((doc) => {
            const category = {
              id: doc.id,
              ...doc.data(),
            };
            commit(
              "setItem",
              { resource: "categories", item: category },
              { root: true }
            );
            return category;
          });
          resolve(categories);
        });
      });
    },
  },
};
