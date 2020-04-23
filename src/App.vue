<template>
  <div id="app">
    <ShoppingList/>
  </div>
</template>

<script lang="ts">

import ShoppingList from "./components/ShoppingList.vue"

export default {
  name: "app",
  components: {
    ShoppingList
  }
};
</script>

<style>
</style>
