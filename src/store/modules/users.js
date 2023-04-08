import { db } from "@/firebase";
import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import {
  docToResource,
  findById,
  makeAppendChildToParentMutation,
  makeFetchItemAction,
  makeFetchItemsAction,
} from "@/helpers";

export default {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {
    user: (state, getters, rootState) => {
      return (id) => {
        const user = findById(state.items, id);
        if (!user) return null;
        return {
          ...user,
          get posts() {
            return rootState.posts.items.filter(
              (post) => post.userId === user.id
            );
          },
          get postsCount() {
            return user.postsCount || 0;
          },
          get threads() {
            return rootState.threads.items.filter(
              (thread) => thread.userId === user.id
            );
          },
          get threadIds() {
            return user.threads;
          },
          get threadsCount() {
            return user.threads?.length || 0;
          },
        };
      };
    },
  },
  actions: {
    async createUser({ commit }, { id, name, username, email, avatar = null }) {
      const registeredAt = serverTimestamp();
      const usernameLower = username.toLowerCase();
      email = email.toLowerCase();
      const user = {
        registeredAt,
        name,
        username,
        usernameLower,
        email,
        avatar,
      };
      const userRef = doc(db, "users", id);
      await setDoc(userRef, user);
      const newUser = await getDoc(userRef);
      commit(
        "setItem",
        {
          resource: "users",
          item: newUser,
        },
        { root: true }
      );
      return docToResource(newUser);
    },
    async updateUser({ commit }, user) {
      const updates = {
        avatar: user.avatar || null,
        username: user.username || null,
        name: user.name || null,
        bio: user.bio || null,
        website: user.website || null,
        email: user.email || null,
        location: user.location || null,
      };
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, updates);
      commit("setItem", { resource: "users", item: user }, { root: true });
    },
    fetchUser: makeFetchItemAction({ emoji: "🙋", resource: "users" }),
    fetchUsers: makeFetchItemsAction({ emoji: "🙋", resource: "users" }),
  },
  mutations: {
    appendThreadToUser: makeAppendChildToParentMutation({
      parent: "users",
      child: "threads",
    }),
  },
};
