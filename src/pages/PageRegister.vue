<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <VeeForm @submit="register" class="card card-form">
        <h1 class="text-center">Register</h1>
        <AppFormField
          name="name"
          label="Full Name"
          v-model="form.name"
          type="text"
          rules="required"
        />

        <AppFormField
          name="username"
          label="Username"
          v-model="form.username"
          type="text"
          rules="required|unique:users,username"
        />

        <AppFormField
          name="email"
          label="Email"
          v-model="form.email"
          type="email"
          rules="required|email|unique:users,email"
        />

        <AppFormField
          name="password"
          label="Password"
          v-model="form.password"
          type="password"
          rules="required|min:8"
        />

        <div class="form-group">
          <label for="avatar"
            >Avatar
            <div v-if="avatarPreview">
              <img :src="avatarPreview" class="avatar-xlarge" />
            </div>
          </label>
          <VeeField
            name="avatar"
            v-show="!avatarPreview"
            id="avatar"
            type="file"
            class="form-input"
            accept="image/*"
            @change="handleImageUpload"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>
      </VeeForm>
      <div class="text-center push-top">
        <button @click="registerWithGoogle" class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import useAsyncDataStatus from "@/composables/useAsyncDataStatus";

const store = useStore();
const router = useRouter();
const { makeReady } = useAsyncDataStatus();

const avatarPreview = ref(null);
const form = reactive({
  name: "",
  username: "",
  email: "",
  password: "",
  avatar: "",
});

const register = async () => {
  await store.dispatch("auth/registerWithEmailAndPassword", this.form);
  router.push({ name: "Home" });
};
const registerWithGoogle = async () => {
  await store.dispatch("auth/signInWithGoogle");
  router.push({ name: "Home" });
};
const handleImageUpload = (e) => {
  form.avatar = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    avatarPreview.value = event.target.result;
  };
  reader.readAsDataURL(form.avatar);
};

makeReady();
</script>
