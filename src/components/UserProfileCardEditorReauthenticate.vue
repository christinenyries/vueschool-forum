<template>
  <VueFinalModal
    v-model="showModal"
    classes="modal-container"
    content-class="modal"
  >
    <div class="modal-content">
      <h4>Login Again to Change Your Account Credentials</h4>
      <VeeForm @submit="reauthenticate">
        <AppFormField
          v-model="email"
          name="reauth-email"
          label="Email"
          type="email"
        />
        <AppFormField
          v-model="password"
          name="reauth-password"
          label="Password"
          type="password"
        />
        <button class="btn btn-green btn-small">Login</button>
      </VeeForm>
    </div>
  </VueFinalModal>
</template>

<script>
import { VueFinalModal } from "vue-final-modal";

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    VueFinalModal,
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    showModal: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  methods: {
    async reauthenticate() {
      try {
        await this.$store.dispatch("auth/reauthenticate", {
          email: this.email,
          password: this.password,
        });
        this.$emit("success");
      } catch (error) {
        this.$emit("fail", error);
      }
    },
  },
};
</script>
