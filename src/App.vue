<template>
  <div id="app">
    <router-view @add-shopping-list="addShoppingList"></router-view>
  </div>
</template>

<script lang="ts">
export default {
  name: "app",
  data() {
    return {
      persistance: [] as any
    };
  },
  methods: {
    addShoppingList(shoppingList: any) {
      this.persistance.push(shoppingList);
    }
  },
};
</script>

<style>
body {
  background-color: darkslateblue;
}
</style>
