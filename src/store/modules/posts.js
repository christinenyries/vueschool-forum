import { db } from "@/firebase";
import {
  doc,
  collection,
  getDoc,
  arrayUnion,
  writeBatch,
  serverTimestamp,
  increment,
  updateDoc,
} from "firebase/firestore";
import { makeFetchItemAction, makeFetchItemsAction } from "@/helpers";

export default {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {},
  actions: {
    fetchPost: makeFetchItemAction({ emoji: "💬", resource: "posts" }),
    fetchPosts: makeFetchItemsAction({ emoji: "💬", resource: "posts" }),
    async createPost({ commit, rootState }, post) {
      post.userId = rootState.auth.authId;
      post.publishedAt = serverTimestamp();
      post.firstInThread = post.firstInThread || false;
      const batch = writeBatch(db);
      const userRef = doc(db, "users", rootState.auth.authId);
      const postRef = doc(collection(db, "posts"));
      const threadRef = doc(db, "threads", post.threadId);
      batch.set(postRef, post);

      const threadUpdates = {
        posts: arrayUnion(postRef.id),
      };
      if (!post.firstInThread) {
        threadUpdates.contributors = arrayUnion(rootState.auth.authId);
      }
      batch.update(threadRef, threadUpdates);
      batch.update(userRef, {
        postsCount: increment(1),
      });
      await batch.commit();
      const newPost = await getDoc(postRef);
      commit(
        "setItem",
        {
          resource: "posts",
          item: newPost,
        },
        { root: true }
      );
      commit(
        "threads/appendPostToThread",
        {
          childId: newPost.id,
          parentId: post.threadId,
        },
        { root: true }
      );
      if (!post.firstInThread) {
        commit(
          "threads/appendContributorToThread",
          {
            childId: rootState.auth.authId,
            parentId: post.threadId,
          },
          { root: true }
        );
      }
    },
    async updatePost({ commit, rootState }, { text, id }) {
      const post = {
        text,
        edited: {
          at: serverTimestamp(),
          by: rootState.auth.authId,
          moderated: false,
        },
      };
      const postRef = doc(db, "posts", id);
      await updateDoc(postRef, post);
      const updatedPost = await getDoc(postRef);
      commit(
        "setItem",
        { resource: "posts", item: updatedPost },
        { root: true }
      );
    },
  },
};
