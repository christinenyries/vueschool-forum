<template>
  <div class="forum-listing" v-for="forum in forums" :key="forum.id">
    <div class="forum-details">
      <router-link
        :to="{ name: 'Forum', params: { id: forum.id } }"
        class="text-xlarge"
        >{{ forum.name }}</router-link
      >

      <p class="forum-description">{{ forum.description }}</p>
    </div>

    <div class="threads-count">
      <p>
        <span class="count text-lead">{{ forum.threads?.length || 0 }} </span>
        {{ (forum.threads?.length || 0) > 1 ? "threads" : "thread" }}
      </p>
    </div>

    <div class="last-thread"></div>
  </div>
</template>

<script>
export default {
  props: {
    forums: {
      required: true,
      type: Array,
    },
  },
};
</script>
