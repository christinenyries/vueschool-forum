import { createApp } from "vue";
import { createPinia } from "pinia";
import { createHead } from "@vueuse/head";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import FontAwesome from "@/plugins/FontAwesome";
import ClickOutsideDirective from "./plugins/ClickOutsideDirective";
import PageScrollDirective from "./plugins/PageScrollDirective";
import Vue3Pagination from "./plugins/Vue3Pagination";
import VeeValidatePlugin from "./plugins/VeeValidatePlugin";

const forumApp = createApp(App);
forumApp.use(router);
forumApp.use(store);
forumApp.use(createPinia());
forumApp.use(FontAwesome);
forumApp.use(ClickOutsideDirective);
forumApp.use(PageScrollDirective);
forumApp.use(Vue3Pagination);
forumApp.use(VeeValidatePlugin);
forumApp.use(createHead());

const globalComponents = import.meta.globEager("./components/App*.vue");
for (const [path, definition] of Object.entries(globalComponents)) {
  const globalComponentName = path
    .split("/")
    .pop()
    .replace(/\.\w+$/, "");
  forumApp.component(globalComponentName, definition.default);
}

forumApp.mount("#app");
