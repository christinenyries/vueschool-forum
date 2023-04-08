<template>
  <div class="profile-card">
    <VeeForm @submit="save">
      <p class="text-center avatar-edit">
        <label for="avatar">
          <AppAvatarImg
            :src="activeUser.avatar"
            :alt="`${user.name} profile picture`"
            class="avatar-xlarge img-update"
          />
          <div class="avatar-upload-overlay">
            <AppSpinner v-if="uploadingImage" color="white" />
            <fa
              v-else
              icon="camera"
              size="3x"
              :style="{ color: 'white', opacity: 0.8 }"
            />
          </div>
          <input
            v-show="false"
            type="file"
            id="avatar"
            @change="handleAvatarUpload"
            accept="image/*"
          />
        </label>
      </p>
      <UserProfileCardEditorRandomAvatar @hit="activeUser.avatar = $event" />

      <AppFormField
        name="username"
        label="Username"
        v-model="activeUser.username"
        type="text"
        :rules="`required|unique:users,username,${user.username}`"
      />
      <AppFormField
        name="name"
        label="Full Name"
        v-model="activeUser.name"
        type="text"
        rules="required"
      />
      <AppFormField
        name="bio"
        label="Bio"
        v-model="activeUser.bio"
        as="textarea"
        placeholder="Write a few words about yourself."
      />

      <div class="stats">
        <span>{{ user.postsCount }} posts</span>
        <span>{{ user.threadsCount }} threads</span>
      </div>

      <hr />

      <AppFormField
        name="website"
        label="Website"
        v-model="activeUser.website"
        type="text"
        rules="url"
        placeholder="Write a few words about yourself."
      />

      <AppFormField
        name="email"
        label="Email"
        v-model="activeUser.email"
        type="email"
        :rules="`required|email|unique:users,email,${user.email}`"
      />

      <AppFormField
        name="new-password"
        label="New Password"
        v-model="newPassword"
        type="password"
        rules="min:8"
      />

      <AppFormField
        name="location"
        label="Location"
        v-model="activeUser.location"
        type="text"
        list="locations"
        @mouseenter.once="loadLocationOptions"
      />
      <datalist id="locations">
        <option
          v-for="location in locationOptions"
          :value="location.name.common"
          :key="location.name.common"
        />
      </datalist>

      <div class="btn-group space-between">
        <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </VeeForm>
    <UserProfileCardEditorReauthenticate
      v-model="showReAuth"
      @success="onReauthenticated"
      @fail="onReauthenticatedFailed"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import UserProfileCardEditorRandomAvatar from "./UserProfileCardEditorRandomAvatar.vue";
import UserProfileCardEditorReauthenticate from "./UserProfileCardEditorReauthenticate.vue";
import useNotifications from "@/composables/useNotifications";

export default {
  components: {
    UserProfileCardEditorRandomAvatar,
    UserProfileCardEditorReauthenticate,
  },
  setup() {
    const { addNotification } = useNotifications();
    return { addNotification };
  },
  data() {
    return {
      activeUser: { ...this.user },
      uploadingImage: false,
      locationOptions: [],
      newPassword: "",
      showReAuth: false,
    };
  },
  props: {
    user: {
      required: true,
      type: Object,
    },
  },
  computed: {
    emailChanged() {
      return this.activeUser.email !== this.user.email;
    },
    needsReAuth() {
      return this.emailChanged || this.newPassword;
    },
  },
  methods: {
    ...mapActions("users", ["updateUser"]),
    ...mapActions("auth", ["uploadAvatar", "updateEmail", "updatePassword"]),
    async loadLocationOptions() {
      const res = await fetch("https://restcountries.com/v3.1/all");
      this.locationOptions = await res.json();
    },
    async handleAvatarUpload(e) {
      this.uploadingImage = true;
      const file = e.target.files[0];
      const uploadedImage = await this.uploadAvatar({ file });
      this.activeUser.avatar = uploadedImage || this.activeUser.avatar;
      this.uploadingImage = false;
    },
    async handleRandomAvatarUpload() {
      const randomAvatarGenerated =
        this.activeUser.avatar.startsWith("https://pixabay");
      if (randomAvatarGenerated) {
        const image = await fetch(this.activeUser.avatar);
        const blob = await image.blob();
        this.activeUser.avatar = await this.uploadAvatar({
          file: blob,
          filename: "random",
        });
      }
    },
    cancel() {
      this.$router.push({ name: "Profile" });
    },
    onReauthenticatedFailed() {
      this.addNotification({
        message: "Error updating user",
        type: "error",
        timeout: 3000,
      });
      this.router.push({ name: "Profile" });
    },
    async onReauthenticated() {
      if (this.emailChanged) {
        await this.updateEmail({
          email: this.activeUser.email,
        });
      }
      if (this.newPassword) {
        await this.updatePassword({ password: this.newPassword });
        this.newPassword = "";
      }
      await this.saveUserData();
    },
    async saveUserData() {
      await this.updateUser({
        ...this.activeUser,
        threads: this.activeUser.threadIds,
      });
      this.$router.push({ name: "Profile" });
      this.addNotification({
        message: "User successfully updated",
        timeout: 3000,
      });
    },
    async save() {
      if (this.activeUser.avatar) {
        await this.handleRandomAvatarUpload();
      }
      if (this.needsReAuth) {
        this.showReAuth = true;
      } else {
        await this.saveUserData();
      }
    },
  },
};
</script>
