<template>
  <span :title="humanFriendlyDate">
    {{ diffForHumans }}
  </span>
</template>

<script>
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export default {
  props: {
    timestamp: {
      required: true,
      type: [Number, Object],
    },
  },
  computed: {
    normalizedTimestamp() {
      return this.timestamp?.seconds || this.timestamp;
    },
    humanFriendlyDate() {
      return dayjs.unix(this.normalizedTimestamp).format("llll");
    },
    diffForHumans() {
      return dayjs.unix(this.normalizedTimestamp).fromNow();
    },
  },
};
</script>
