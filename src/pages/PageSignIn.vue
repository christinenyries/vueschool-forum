<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <VeeForm @submit="signIn" class="card card-form">
        <h1 class="text-center">Login</h1>

        <AppFormField
          name="email"
          label="Email"
          v-model="form.email"
          type="email"
          rules="required|email"
        />

        <AppFormField
          name="password"
          label="Password"
          v-model="form.password"
          type="password"
          rules="required"
        />

        <div class="push-top">
          <button type="submit" class="btn-blue btn-block">Log in</button>
        </div>

        <div class="form-actions text-right">
          <RouterLink :to="{ name: 'Register' }">Create an account?</RouterLink>
        </div>
      </VeeForm>

      <div class="push-top text-center">
        <button @click="signInWithGoogle" class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import useAsyncDataStatus from "@/composables/useAsyncDataStatus";

const store = useStore();
const route = useRoute();
const router = useRouter();

const { makeReady } = useAsyncDataStatus();

const form = reactive({
  email: "",
  password: "",
});

const signIn = async () => {
  try {
    await store.dispatch("auth/signInWithEmailAndPassword", form);
    successRedirect();
  } catch (error) {
    alert(error.message);
  }
};
const signInWithGoogle = async () => {
  await store.dispatch("auth/signInWithGoogle");
  successRedirect();
};
const successRedirect = () => {
  const redirectTo = route.query.redirectTo || { name: "Home" };
  router.push(redirectTo);
};

makeReady();
</script>
