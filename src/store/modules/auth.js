import { db, auth, storage } from "@/firebase";
import {
  where,
  doc,
  query,
  collection,
  getDoc,
  getDocs,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import useNotifications from "@/composables/useNotifications";

export default {
  namespaced: true,
  state: {
    authId: null,
    authUserUnsubscribe: null,
    authObserverUnsubscribe: null,
  },
  getters: {
    authUser(state, getters, rootState, rootGetters) {
      return rootGetters["users/user"](state.authId);
    },
  },
  actions: {
    initAuthentication({ dispatch, commit, state }) {
      if (state.authObserverUnsubscribe) {
        state.authObserverUnsubscribe();
      }
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          dispatch("unsubscribeAuthUserSnapshot");
          if (user) {
            await dispatch("fetchAuthUser");
            resolve(user);
          } else {
            resolve(null);
          }
        });
        commit("setAuthObserverUnsubscribe", unsubscribe);
      });
    },
    reauthenticate: async (context, { email, password }) => {
      const userCredential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(auth.currentUser, userCredential);
    },
    updateEmail: async (context, { email }) => {
      await updateEmail(auth.currentUser, email);
    },
    updatePassword: async (context, { password }) => {
      await updatePassword(auth.currentUser, password);
    },
    fetchAuthUser: async ({ dispatch, commit }) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      await dispatch(
        "fetchItem",
        {
          resource: "users",
          id: userId,
          emoji: "🙋",
          handleUnsubscribe: (unsubscribe) =>
            commit("setAuthUserUnsubscribe", unsubscribe),
        },
        { root: true }
      );
      commit("setAuthId", userId);
    },
    async fetchAuthUserPosts({ commit, state }, { lastPostFetched }) {
      const postsRef = collection(db, "posts");
      const postsQueryClauses = [
        where("userId", "==", state.authId),
        orderBy("publishedAt", "desc"),
        limit(10),
      ];
      if (lastPostFetched) {
        const lastPostFetchedRef = doc(db, "posts", lastPostFetched.id);
        const lastPostFetchedDoc = await getDoc(lastPostFetchedRef);
        postsQueryClauses.push(startAfter(lastPostFetchedDoc));
      }
      const postsQuery = query(postsRef, ...postsQueryClauses);
      const posts = await getDocs(postsQuery);
      posts.forEach((item) => {
        commit("setItem", { resource: "posts", item }, { root: true });
      });
    },
    async signInWithGoogle({ dispatch }) {
      const provider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        return dispatch(
          "users/createUser",
          {
            id: user.uid,
            name: user.displayName,
            email: user.email,
            username: user.email,
            avatar: user.photoURL,
          },
          { root: true }
        );
      }
    },
    signInWithEmailAndPassword(context, { email, password }) {
      return signInWithEmailAndPassword(auth, email, password);
    },
    async signOut({ commit }) {
      await signOut(auth);
      commit("setAuthId", null);
    },
    async uploadAvatar({ state }, { authId, file, filename }) {
      try {
        if (!file) return null;
        authId = authId || state.authId;
        filename = filename || file.name;
        const bucketRef = ref(
          storage,
          `uploads/${authId}/images/${Date.now()}-${filename}`
        );
        const uploadResult = await uploadBytes(bucketRef, file);
        const url = await getDownloadURL(uploadResult.ref);
        return url;
      } catch (error) {
        const { addNotification } = useNotifications();
        addNotification({
          message: "Error uploading avatar image",
          type: "error",
        });
      }
    },
    async registerWithEmailAndPassword(
      { dispatch },
      { name, username, email, password, avatar = null }
    ) {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      avatar = await dispatch("uploadAvatar", {
        authId: userCredential.user.uid,
        file: avatar,
      });
      await dispatch(
        "users/createUser",
        {
          id: userCredential.user.uid,
          name,
          username,
          email,
          avatar,
        },
        { root: true }
      );
    },
    async unsubscribeAuthUserSnapshot({ state, commit }) {
      if (state.authUserUnsubscribe) {
        state.authUserUnsubscribe();
      }
      commit("setAuthUserUnsubscribe", null);
    },
  },
  mutations: {
    setAuthUserUnsubscribe(state, unsubscribe) {
      state.authUserUnsubscribe = unsubscribe;
    },
    setAuthObserverUnsubscribe(state, unsubscribe) {
      state.authObserverUnsubscribe = unsubscribe;
    },
    setAuthId(state, id) {
      state.authId = id;
    },
  },
};
