<template>
  <header
    class="header"
    id="header"
    v-click-outside="() => (mobileNavMenu = false)"
    v-page-scroll="() => (mobileNavMenu = false)"
  >
    <router-link :to="{ name: 'Home' }" class="logo">
      <img src="../assets/svg/vueschool-logo.svg" />
    </router-link>

    <div class="btn-hamburger" @click="mobileNavMenu = !mobileNavMenu">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar" :class="{ 'navbar-open': mobileNavMenu }">
      <ul>
        <li v-if="authUser" class="navbar-user">
          <a
            @click.prevent="userDropdownOpen = !userDropdownOpen"
            v-click-outside="() => (userDropdownOpen = false)"
          >
            <AppAvatarImg
              class="avatar-small"
              :src="authUser.avatar"
              :alt="`${authUser.name} profile picture`"
            />
            <span>
              {{ authUser.name }}
              <img
                class="icon-profile"
                src="../assets/svg/arrow-profile.svg"
                alt=""
              />
            </span>
          </a>

          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown" :class="{ 'active-drop': userDropdownOpen }">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                <RouterLink :to="{ name: 'Profile' }">Profile</RouterLink>
              </li>
              <li class="dropdown-menu-item">
                <a @click.prevent="signOut">Sign Out</a>
              </li>
            </ul>
          </div>
        </li>
        <li v-if="!authUser" class="navbar-item">
          <RouterLink :to="{ name: 'SignIn' }">Sign In</RouterLink>
        </li>
        <li v-if="!authUser" class="navbar-item">
          <RouterLink :to="{ name: 'Register' }">Register</RouterLink>
        </li>
        <li v-if="authUser" class="navbar-mobile-item">
          <RouterLink :to="{ name: 'Profile' }">Profile</RouterLink>
        </li>
        <li v-if="authUser" class="navbar-mobile-item">
          <a @click.prevent="signOut">Sign Out</a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      userDropdownOpen: false,
      mobileNavMenu: false,
    };
  },
  computed: {
    ...mapGetters("auth", ["authUser"]),
  },
  methods: {
    async signOut() {
      await this.$store.dispatch("auth/signOut");
      this.$router.push({ name: "Home" });
    },
  },
  created() {
    this.$router.beforeEach(() => {
      this.mobileNavMenu = false;
    });
  },
};
</script>
