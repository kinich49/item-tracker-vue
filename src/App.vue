<template>
  <div id="app">
    <router-view @add-shopping-list='addShoppingList'></router-view>
  </div>
</template>

<script lang="ts">

export default {
  name: "app",
  data() {
    return {
      s : [] as any
    }
  }, 
  methods: {
    addShoppingList(shoppingList:any) {
     this.s.push(shoppingList)
    }
  }
};
</script>

<style>
</style>
