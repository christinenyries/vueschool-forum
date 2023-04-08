<template>
  <VeeForm @submit="save" :key="formKey">
    <AppFormField
      name="content"
      v-model="postCopy.text"
      rules="required"
      rows="8"
      cols="140"
      as="textarea"
    />

    <div class="btn-group">
      <button class="btn btn-blue" type="submit">
        {{ post.id ? "Update Post" : "Submit Post" }}
      </button>
    </div>
  </VeeForm>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      default: () => ({ text: null }),
    },
  },
  data() {
    return {
      postCopy: { ...this.post },
      formKey: Math.random(),
    };
  },
  methods: {
    save() {
      this.$emit("save", { post: this.postCopy });
      this.postCopy.text = "";
      this.formKey = Math.random();
    },
  },
};
</script>
