import { createWebHistory, createRouter } from "vue-router";

import store from "@/store";
import { findById } from "@/helpers";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/pages/PageHome.vue"),
  },
  {
    path: "/me",
    name: "Profile",
    component: () => import("@/pages/PageProfile.vue"),
    meta: { toTop: true, smoothScroll: true, requiresAuth: true },
  },
  {
    path: "/me/edit",
    name: "ProfileEdit",
    component: () => import("@/pages/PageProfile.vue"),
    props: { edit: true },
    meta: { requiresAuth: true },
  },
  {
    path: "/threads/:id",
    name: "ThreadShow",
    component: () => import("@/pages/PageThreadShow.vue"),
    props: true,
    async beforeEnter(to) {
      await store.dispatch("threads/fetchThread", {
        id: to.params.id,
        once: true,
      });
      const threadExists = findById(store.state.threads.items, to.params.id);
      if (!threadExists) {
        return {
          name: "NotFound",
          // preserve current path and remove the first char to avoid the target URL starting with `//`
          params: { pathMatch: to.path.substring(1).split("/") },
          // preserve existing query and hash if any
          query: to.query,
          hash: to.hash,
        };
      }
    },
  },
  {
    path: "/forums/:forumId/threads/create",
    name: "ThreadCreate",
    component: () => import("@/pages/PageThreadCreate.vue"),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/threads/:id/edit",
    name: "ThreadEdit",
    component: () => import("@/pages/PageThreadEdit.vue"),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/categories/:id",
    name: "Category",
    component: () => import("@/pages/PageCategory.vue"),
    props: true,
  },
  {
    path: "/forums/:id",
    name: "Forum",
    component: () => import("@/pages/PageForum.vue"),
    props: true,
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/pages/PageRegister.vue"),
    meta: { requiresUnauth: true },
  },
  {
    path: "/signin",
    name: "SignIn",
    component: () => import("@/pages/PageSignIn.vue"),
    meta: { requiresUnauth: true },
  },
  {
    path: "/logout",
    name: "SignOut",
    async beforeEnter() {
      await store.dispatch("auth/signOut");
      return { name: "Home" };
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/pages/PageNotFound.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    const scroll = {};
    if (to.meta.toTop) scroll.top = 0;
    if (to.meta.smoothScroll) scroll.behavior = "smooth";
    return scroll;
  },
});
router.afterEach((to, from) => {
  if (to.path == from.path) return;
  store.dispatch("clearItems", {
    modules: ["categories", "forums", "posts", "threads"],
  });
});
router.beforeEach(async (to) => {
  await store.dispatch("auth/initAuthentication");
  await store.dispatch("unsubscribeAllSnapshots");
  if (to.meta.requiresAuth && !store.state.auth.authId) {
    return { name: "SignIn", query: { redirectTo: to.path } };
  }
  if (to.meta.requiresUnauth && store.state.auth.authId) {
    return { name: "Home" };
  }
});
export default router;
