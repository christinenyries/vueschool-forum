<template>
  <AppHead>
    <title>Vue.js 3 Master Class Forum</title>
    <meta name="description" content="An awesome Vue.js 3 powered forum!" />

    <!-- Social -->
    <meta property="og:title" content="Vue.js 3 Master Class Forum" />
    <meta
      property="og:description"
      content="An Awesome Vue.js 3 powered forum!"
    />
    <meta
      property="og:image"
      content="https://vueschool.io/media/f007f6057444d9a7f567163391d2b366/vuejs-3-master-class-not-transparent.jpg"
    />

    <!-- Twitter -->
    <meta name="twitter:title" content="Vue.js 3 Master Class Forum" />
    <meta
      name="twitter:description"
      content="An Awesome Vue.js 3 powered forum!"
    />
    <meta
      name="twitter:image"
      content="https://vueschool.io/media/f007f6057444d9a7f567163391d2b366/vuejs-3-master-class-not-transparent.jpg"
    />
    <meta name="twitter:card" content="summary_large_image" />
  </AppHead>
  <TheNavbar />
  <div class="container">
    <RouterView
      v-show="ready"
      :key="`${route.path}${JSON.stringify(route.query)}`"
    />
    <AppSpinner v-show="!ready" class="push-top" />
  </div>
  <AppNotifications />
</template>

<script setup>
import NProgress from "nprogress";

import TheNavbar from "./components/TheNavbar.vue";
import useAsyncDataStatus from "./composables/useAsyncDataStatus";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { watchEffect } from "vue";

const store = useStore();
const router = useRouter();
const route = useRoute();
const { ready } = useAsyncDataStatus();

watchEffect(() => {
  if (ready.value) {
    NProgress.done();
  }
});

store.dispatch("auth/fetchAuthUser");

NProgress.configure({
  speed: 200,
  showSpinner: false,
});
router.beforeEach(() => {
  NProgress.start();
});
</script>

<style>
@import "assets/style.css";
@import "../node_modules/nprogress/nprogress.css";
#nprogress .bar {
  background: #57ad8d !important;
}
</style>
