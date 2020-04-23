<template>
  <div>
    <form>
      <label>Shoping Date</label>
      <input v-model="shoppingDate" type="date"/>
      <br />
      <label>Store</label>
      <input v-model="store" />
      <br />
    </form>
    <br/>
    <ShoppingItem
      v-for="item in shoppingItems"
      v-bind:key="item.id"
      v-bind:id="item.id"
    />
    <button v-on:click="addItem()">Add Item</button>
  </div>
</template>

<script>
import ShoppingItem from "./ShoppingItem.vue";

export default {
  name: "ShoppingList",
  data() {
    return {
      shoppingDate: null,
      store: null,
      shoppingItems: []
    };
  },
  methods: {
    addItem() {
      this.shoppingItems.push({ id: this.shoppingItems.length + 1 });
    }
  },
  components: {
    ShoppingItem
  }
};
</script>