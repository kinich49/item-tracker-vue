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

      <div id="empty-message-container" v-if="shoppingItems.length <= 0">
        <p id="empty-message">No items yet. Try adding something!</p>
      </div>

      <div v-else id="shopping-list">
        <ShoppingItem
          v-for="shoppingItem in shoppingItems"
          v-bind:key="shoppingItem.index"
          v-bind:item.sync="shoppingItem.item"
        />
      </div>

      <v-btn
        color="secondary"
        tile
        id="submit-shopping-list"
        v-on:click="submitShoppingList()"
        :disabled="!isReadyToSumbit"
      >Save</v-btn>
    </div>
    <v-btn block id="shopping-add-item" color="primary" v-on:click="addBlankShoppingItem()">Add Item</v-btn>
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
        placeholder: "Where did you shop?"
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
    ". . . submit-list"
    "shopping-list shopping-list shopping-list shopping-list";
  padding: 0 24px;
}

#shopping-label {
  margin-top: 0.5em;
  grid-area: shopping-label;
  justify-self: center;
  text-align: center;
  line-height: 90%;
}

#shopping-store-label {
  grid-area: store-label;
  padding-right: 0.5em;
  justify-self: end;
  text-align: right;
}

#shopping-store-input {
  grid-area: store-input;
}

#shopping-date-label {
  grid-area: date-label;
  padding-right: 0.5em;
  justify-self: end;
  text-align: right;
}

#shopping-date-input {
  grid-area: date-input;
}

#submit-shopping-list {
  grid-area: submit-list;
  border: none;
  box-sizing: border-box;
  padding: 14px 28px;
}

#shopping-add-item {
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
}

#shopping-list {
  grid-area: shopping-list;
  display: flex;
  flex-direction: column-reverse;
  gap: 1em;
  margin-bottom: 100px;
  margin-top: 1em;
}

#empty-message-container {
  grid-area: shopping-list;
  display: flex;
  align-items: center;
  height: 60vh;
  justify-self: center;
}

#empty-message {
  color: dimgray;
}
</style>  