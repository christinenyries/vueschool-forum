<template>
  <div class="text-center" style="margin-bottom: 15px">
    <button class="btn-green btn-small" @click.prevent="getRandomImage">
      Random Avatar
    </button>
    <br />
    <small style="opacity: 0.5"
      >Powered by <a href="https://pixabay.com">Pixabay</a></small
    >
  </div>
</template>

<script>
import { arrayRandom } from "@/helpers";
export default {
  methods: {
    async getRandomImage() {
      const searchTerms = [
        "cats",
        "dogs",
        "abstract",
        "cars",
        "mountains",
        "beach",
        "landscape",
        "object",
        "food",
        "flowers",
        "architecture",
        "yellow",
        "green",
        "blue",
        "orange",
        "black",
        "white",
        "brown",
        "red",
        "patterns",
        "animal",
        "code",
        "space",
      ];
      const randomWord = arrayRandom(searchTerms);
      const res = await fetch(
        `https://pixabay.com/api/?key=35156135-28ddaed71add3f2a5d7060786&q=${randomWord}`
      );
      const data = await res.json();
      const randomImage = arrayRandom(data.hits);
      this.$emit("hit", randomImage.webformatURL);
    },
  },
};
</script>
