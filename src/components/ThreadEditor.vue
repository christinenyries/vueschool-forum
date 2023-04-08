<template>
  <VeeForm @submit="save">
    <AppFormField
      name="title"
      label="Title"
      v-model="form.title"
      type="text"
      rules="required"
    />
    <AppFormField
      name="content"
      label="Content"
      v-model="form.text"
      rules="required"
      rows="8"
      cols="140"
      as="textarea"
    />

    <div class="btn-group">
      <button class="btn btn-ghost" @click.prevent="cancel">Cancel</button>
      <button class="btn btn-blue" type="submit" name="Publish">
        {{ existing ? "Update" : "Publish" }}
      </button>
    </div>
  </VeeForm>
</template>

<!-- <script setup>
import { reactive, computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["save", "cancel"]);

const form = reactive({
  title: props.title,
  text: props.text,
});

const existing = computed(() => !!props.title);

function save() {
  emit("save", { ...form });
}
function cancel() {
  emit("cancel");
}
</script> -->

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {
        title: this.title,
        text: this.text,
      },
    };
  },
  computed: {
    existing() {
      return !!this.title;
    },
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    async save() {
      this.$emit("clean");
      this.$emit("save", { ...this.form });
    },
  },
  watch: {
    form: {
      handler() {
        if (this.form.title !== this.title || this.form.text !== this.text) {
          this.$emit("dirty");
        } else {
          this.$emit("clean");
        }
      },
      deep: true,
    },
  },
};
</script>
