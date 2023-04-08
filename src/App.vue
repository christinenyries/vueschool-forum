<template>
  <TheNavbar />
  <div class="container">
    <RouterView
      v-show="showPage"
      @ready="onPageReady"
      :key="`${$route.path}${JSON.stringify($route.query)}`"
    />
    <AppSpinner v-show="!showPage" class="push-top" />
  </div>
  <AppNotifications />
</template>

<script>
import { mapActions } from "vuex";
import TheNavbar from "./components/TheNavbar.vue";
import NProgress from "nprogress";

export default {
  name: "App",
  components: { TheNavbar },
  data() {
    return {
      showPage: false,
    };
  },
  methods: {
    ...mapActions("auth", ["fetchAuthUser"]),
    onPageReady() {
      this.showPage = true;
      NProgress.done();
    },
  },
  created() {
    this.fetchAuthUser();
    NProgress.configure({
      speed: 200,
      showSpinner: false,
    });
    this.$router.beforeEach(() => {
      this.showPage = false;
      NProgress.start();
    });
  },
};
</script>

<style>
@import "assets/style.css";
@import "~nprogress/nprogress.css";
#nprogress .bar {
  background: #57ad8d !important;
}
</style>
