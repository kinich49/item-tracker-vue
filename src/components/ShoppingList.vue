<template>
  <div>
    <form>
      <label>Shoping Date</label>
      <input v-model="shoppingDate" type="date" />
      <br />
      <vue-autosuggest
        :suggestions="filteredStoreOptions"
        :limit="10"
        :input-props="storeProps"
        :render-suggestion="renderSuggestion"
        @input="onStoreInputChanged"
        @selected="onStoreSelected"
      >
        <template slot="before-input">
          <label>Store</label>
        </template>
      </vue-autosuggest>
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
      v-bind:brand.sync="item.brand"
      v-bind:category.sync="item.category"
    />
    <button v-on:click="addBlankShoppingItem()">Add Item</button>
    <button v-on:click="submitShoppingList()" :disabled="!isReadyToSumbit">Submit List</button>
  </div>
</template>

<script>
import ShoppingItem from "./ShoppingItem.vue";
import { VueAutosuggest } from "vue-autosuggest";
import axios from "axios";
import { baseUrl } from "../constants";

export default {
  name: "ShoppingList",
  data() {
    return {
      shoppingDate: null,
      store: null,
      shoppingItems: [],
      valid: true,
      filteredStoreOptions: [],
      storeProps: {
        id: "autosuggest__store_input",
        placeholder: "Where did you go shopping today...?"
      },
      limit: 10
    };
  },
  computed: {
    isReadyToSumbit() {
      if (this.isEmpty(this.shoppingDate)) return false;

      if (this.isEmpty(this.store)) return false;

      let isValid = false;
      for (let item of this.shoppingItems) {
        isValid = this.validateShoppingItem(item);
        if (!isValid) break;
      }
      return isValid;
    }
  },
  methods: {
    onStoreSelected(option) {
      this.store = option.item;
    },
    onStoreInputChanged(text) {
      if (text === "" || text === undefined) {
        return;
      }
      let url = `${baseUrl}/stores?name=${text}`;
      axios
        .get(url)
        .then(result => {
          this.filteredStoreOptions = [
            {
              data: result.data
            }
          ];
        })
        .catch(error => console.log(error));
    },
    addBlankShoppingItem() {
      let id = this.shoppingItems.length + 1;
      let shoppingItem = {
        id: id,
        quantity: null,
        unitPrice: null,
        name: null,
        brand: null,
        category: null
      };
      this.shoppingItems.push(shoppingItem);
    },
    submitShoppingList() {
      // const shoppingList = {
      //   shoppingDate: this.shoppingDate,
      //   store: this.store,
      //   shoppingItems: this.shoppingItems
      // };
      // this.$emit("add-shopping-list", shoppingList);
      // this.$router.push("/");
    },
    validateShoppingItem(item) {
      return (
        item &&
        !this.isEmpty(item.name) &&
        !this.isEmpty(item.brand) &&
        !this.isEmpty(item.category) &&
        !this.isEmpty(item.quantity) &&
        !this.isEmpty(item.unitPrice)
      );
    },
    isEmpty(value) {
      return !value || 0 === value.length;
    },
    renderSuggestion(suggestion) {
      return suggestion.item.name;
    }
  },
  components: {
    ShoppingItem,
    VueAutosuggest
  }
};
</script>