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
      v-bind:name.sync="item.name"
      v-bind:quantity.sync="item.quantity"
      v-bind:unitPrice.sync="item.unitPrice"
    />
    <button v-on:click="addBlankShoppingItem()">Add Item</button>
    <button v-on:click="submitShoppingList()" :disabled="!isReadyToSumbit">Submit List</button>
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
      shoppingItems: [],
      valid: true
    };
  },

  computed: {
    isReadyToSumbit() {
      if (this.isEmpty(this.shoppingDate)) return false

      if (this.isEmpty(this.store)) return false

      let isValid = false;
      for (let item of this.shoppingItems) {
        isValid = this.validateShoppingItem(item);
        if (!isValid) break;
      }
      return isValid;
    }
  },
  methods: {
    addBlankShoppingItem() {
      let id = this.shoppingItems.length + 1;
      let shoppingItem = {
        id: id,
        quantity: null,
        unitPrice: null,
        name: null
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
      this.$router.push("/");
    },
    validateShoppingItem(item) {
      return (
        item &&
        !this.isEmpty(item.name) &&
        !this.isEmpty(item.quantity) &&
        !this.isEmpty(item.unitPrice)
      );
    },
    isEmpty(value) {
      return !value || 0 === value.length;
    }
  },
  components: {
    ShoppingItem
  }
};
</script>