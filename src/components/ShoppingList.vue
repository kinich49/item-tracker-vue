<template>
  <div>
    <div class="main">
      <h1 id="shopping-label">Shopping Receipt</h1>
      <label id="shopping-date-label">Shoping Date</label>
      <input id="shopping-date-input" v-model="shoppingDate" type="date" />
      <label id="shopping-store-label">Store</label>
      <vue-autosuggest
        id="shopping-store-input"
        v-model="store.name"
        :suggestions="filteredStoreOptions"
        :limit="10"
        :input-props="storeProps"
        :render-suggestion="renderSuggestion"
        @input="onStoreInputChanged"
        @selected="onStoreSelected"
      />

      <div class="list" id="shopping-list">
        <ShoppingItem
          class="card"
          v-for="shoppingItem in shoppingItems"
          v-bind:key="shoppingItem.index"
          v-bind:item.sync="shoppingItem.item"
        />
      </div>

      <button
        id="submit-shopping-list"
        v-on:click="submitShoppingList()"
        :disabled="!isReadyToSumbit"
      >Submit List</button>
    </div>
    <button id="shopping-add-item" v-on:click="addBlankShoppingItem()">Add Item</button>
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
  },
  metaInfo: {
    meta: [{ name: "viewport", content: "width-device-width, initial-scale=1" }]
  }
};
</script>

<style scoped>
.main {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, minmax(1fr, 75px)) 5fr;
  grid-template-areas:
    ". shopping-label shopping-label ."
    "store-label store-label store-input store-input"
    "date-label date-label date-input date-input"
    ". submit-list submit-list ."
    "shopping-list shopping-list shopping-list shopping-list";
  background-color: rgb(35, 191, 243);
  padding: 0 24px;
}

#shopping-label {
  grid-area: shopping-label;
  justify-self: center;
  text-align: center;
}

#shopping-store-label {
  grid-area: store-label;
  justify-self: end;
  text-align: right;
}

#shopping-store-input {
  grid-area: store-input;
}

#shopping-date-label {
  grid-area: date-label;
  justify-self: end;
  text-align: right;
}

#shopping-date-input {
  grid-area: date-input;
}

#shopping-list {
  grid-area: shopping-list;
}

#submit-shopping-list {
  grid-area: submit-list;
  border: none;
  box-sizing: border-box;
  padding: 14px 28px;
}

#shopping-add-item {
  background-color: #333;
  border: none;
  box-sizing: border-box;
  color: whitesmoke;
  position: fixed;
  bottom: 0;
  padding: 14px 28px;
  width: 100%;
  left: 0;
}

.list {
  box-sizing: border-box;
  padding: 10px;
  margin: 10px;
  border: none;
  background-color: mediumslateblue;
  display: flex;
  flex-direction: column-reverse;
  gap: 1em;
  margin-bottom: 100px;
}

.card {
  -webkit-box-shadow: 10px 10px 16px 0px rgba(0, 0, 0, 0.28);
  -moz-box-shadow: 10px 10px 16px 0px rgba(0, 0, 0, 0.28);
  box-shadow: 10px 10px 16px 0px rgba(0, 0, 0, 0.28);
  background-color: lemonchiffon;
  box-sizing: border-box;
  padding: 1em;
  border-radius: 5px;
}
</style>  