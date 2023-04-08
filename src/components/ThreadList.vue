<template>
  <div class="col-full">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>
      <div v-if="threads.length">
        <div v-for="thread in threads" :key="thread.id" class="thread">
          <div>
            <p>
              <router-link
                :to="{ name: 'ThreadShow', params: { id: thread.id } }"
                >{{ thread.title }}</router-link
              >
            </p>
            <p class="text-faded text-xsmall">
              By <span>{{ userById(thread.userId).name }}</span
              >, <app-date :timestamp="thread.publishedAt" />.
            </p>
          </div>

          <div class="activity">
            <p class="replies-count">{{ thread.repliesCount }} replies</p>

            <AppAvatarImg
              class="avatar-medium"
              :src="userById(thread.userId).avatar"
            />

            <div>
              <p class="text-xsmall">
                <span>{{ userById(thread.userId).name }}</span>
              </p>
              <p class="text-xsmall text-faded">
                <app-date :timestamp="thread.publishedAt" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!threads.length" style="padding: 10px; text-align: center">
      <em>No Threads Available</em>
    </div>
  </div>
</template>

<script>
import { findById } from "@/helpers";
export default {
  props: {
    threads: {
      required: true,
      type: Array,
    },
  },
  computed: {
    users() {
      return this.$store.state.users.items;
    },
  },
  methods: {
    userById(userId) {
      return findById(this.users, userId) || {};
    },
  },
};
</script>
<!-- <script setup>
import { reactive } from "vue";
import { useStore } from "vuex";
import { findById } from "@/helpers";

const users = reactive(useStore().state.users);

defineProps({
  threads: {
    required: true,
    type: Array,
  },
});

function userById(userId) {
  return findById(users, userId) || {};
}
</script> -->
