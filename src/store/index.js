import { createStore } from "vuex";
import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

import categories from "./modules/categories";
import forums from "./modules/forums";
import posts from "./modules/posts";
import threads from "./modules/threads";
import users from "./modules/users";
import auth from "./modules/auth";

export default createStore({
  modules: {
    categories,
    forums,
    posts,
    threads,
    users,
    auth,
  },
  state: {
    unsubscribes: [],
  },
  actions,
  getters,
  mutations,
});
