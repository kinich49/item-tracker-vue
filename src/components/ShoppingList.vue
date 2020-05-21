<template>
  <div>
    <form>
      <label>Shoping Date</label>
      <input v-model="shoppingDate" type="date" />
      <br />
      <vue-autosuggest
        v-model="store.name"
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
    </form>
    <br />
    <ShoppingItem
      v-for="shoppingItem in shoppingItems"
      v-bind:key="shoppingItem.index"
      v-bind:item.sync="shoppingItem.item"
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
import { mixin } from "../mixins/common";

export default {
  name: "ShoppingList",
  mixins: [mixin],
  data() {
    return {
      shoppingDate: null,
      store: {
        id: null,
        name: null
      },
      shoppingItems: [],
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
      if (!this.store) return false;
      if (!this.shoppingDate) return false;

      let isValid = false;
      for (let item of this.shoppingItems) {
        isValid = this.validateShoppingItem(item.item);
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
      this.store.id = null;
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
      let index = this.shoppingItems.length + 1;
      let shoppingItem = {
        index: index,
        item: null
      };
      this.shoppingItems.push(shoppingItem);
    },
    submitShoppingList() {
      let elements = [];
      console.log(this.shoppingItems);
      if (this.shoppingItems && this.shoppingItems.length > 0) {
        elements = this.shoppingItems
          .map(i => i.item)
          .map(i => {
            return {
              itemId: i.id,
              name: i.name,
              category: i.category,
              brand: i.brand,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              unit: i.unit,
              currency: i.currency
            };
          });
      }
      const shoppingList = {
        shoppingDate: this.shoppingDate,
        store: this.store,
        shoppingItems: elements
      };
      const url = `${baseUrl}/shoppingLists`;
      axios
        .post(url, shoppingList)
        .then(response => {
          console.log(response);
          this.$emit("add-shopping-list", shoppingList);
          this.$router.push("/");
        })
        .catch(error => console.log(error));
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