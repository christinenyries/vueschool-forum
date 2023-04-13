import { ref } from "vue";

const ready = ref(false);
export default function useAsyncDataStatus() {
  ready.value = false;
  const makeReady = () => {
    ready.value = true;
  };
  return { ready, makeReady };
}
