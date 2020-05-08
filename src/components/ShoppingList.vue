<template>
  <div>
    <form>
      <label>Shoping Date</label>
      <input v-model="shoppingDate" type="date" />
      <br />
      <label>Store</label>
      <input v-model="store" />
      <br />
    </form>
    <br />
    <ShoppingItem
      v-for="item in shoppingItems"
      v-bind:key="item.id"
      v-bind:id="item.id"
      v-bind:itemName.sync="item.itemName"
      v-bind:quantity.sync="item.quantity"
      v-bind:unitPrice.sync="item.unitPrice"
    />
    <button v-on:click="addItem()">Add Item</button>
    <button v-on:click="submitShoppingList()">Submit List</button>
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
      let id = this.shoppingItems.length + 1;
      let shoppingItem = {
        id: id,
        quantity: null,
        unitPrice: null,
        itemName: null
      };
      this.shoppingItems.push(shoppingItem);
    },
    submitShoppingList() {
      const shoppingList = {
        shoppingDate: this.shoppingDate,
        store: this.store,
        shoppingItems: this.shoppingItems
      };
      this.$emit("add-shopping-list", shoppingList);
    }
  },
  components: {
    ShoppingItem
  }
};
</script>