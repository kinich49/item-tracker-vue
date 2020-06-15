<template>
  <div>
    <div id="main">
      <h1 id="shopping-label">Shopping Receipt</h1>
      <label id="shopping-date-label">Shoping Date</label>
      <input id="shopping-date-input" v-model="shoppingDate" type="date" />
      <v-combobox
        class="shopping-store-input"
        v-model="storeSelection"
        :items="items"
        label="Store"
        :search-input.sync="storeSearch"
        placeholder="Where did you shop?"
        hide-no-data
        clearable
      ></v-combobox>

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
    <div id="fab-container">
      <v-btn fab id="shopping-add-item" color="primary" v-on:click="addBlankShoppingItem()">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import ShoppingItem from "./ShoppingItem.vue";
import axios from "axios";
import { baseUrl } from "../constants";
import { mixin } from "../mixins/common";
import _ from "lodash-es";

export default {
  name: "BlankShoppingList",
  mixins: [mixin],
  data() {
    return {
      shoppingDate: null,
      shoppingItems: [],
      storeSearch: null,
      storeSelection: null,
      storeEntries: null
    };
  },
  computed: {
    isReadyToSumbit() {
      if (!this.storeSelection) return false;
      if (!this.shoppingDate) return false;

      let isValid = false;
      for (let item of this.shoppingItems) {
        isValid = this.validateShoppingItem(item.item);
        if (!isValid) break;
      }
      return isValid;
    },
    items() {
      if (this.storeEntries === null || this.storeEntries.length === 0)
        return [];

      return this.storeEntries.map(storeEntry => {
        return {
          text: storeEntry.name,
          value: storeEntry
        };
      });
    },
    store() {
      if (this.storeSelection === undefined || this.storeSelection === null)
        return null;

      if (_.isString(this.storeSelection)) {
        return {
          id: null,
          name: this.storeSelection
        };
      } else {
        return this.storeSelection.value;
      }
    }
  },
  methods: {
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
        .then(() => {
          this.$router.push("/");
        })
        .catch(error => console.log(error));
    }
  },
  watch: {
    storeSearch(text) {
      if (text === "" || text === undefined) {
        return;
      }
      let url = `${baseUrl}/stores?name=${text}`;
      axios
        .get(url)
        .then(result => {
          this.storeEntries = result.data;
        })
        .catch(error => console.log(error));
    }
  },
  components: {
    ShoppingItem
  }
};
</script>

<style scoped>
#main {
  display: grid;
  padding: 0 24px;
}

#fab-container {
  display: grid;
  position: fixed;
  width: 100%;
  bottom: 0;
  box-sizing: border-box;
  padding: 24px;
}

#shopping-label {
  margin-top: 0.5em;
  grid-area: shopping-label;
  justify-self: center;
  text-align: center;
  line-height: 90%;
}

.shopping-store-input {
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
  grid-area: add-item;
  justify-self: end;
  align-self: start;
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

/* 
  ##Device = Desktops
  ##Screen = 1281px to higher resolution desktops
*/
@media (min-width: 1281px) {
  #main {
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(4, minmax(1fr, 75px)) 5fr 1fr;
    grid-template-areas:
      ". . . shopping-label shopping-label . . ."
      ". . .  store-input store-input . . ."
      ". . date-label date-label date-input date-input . . "
      ". . . .  . submit-list . ."
      ". . shopping-list shopping-list shopping-list shopping-list . .";
  }

  #fab-container {
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: 1fr;
    grid-template-areas: ". . . . . add-item . .";
  }
}

/* 
  ##Device = Most of the Smartphones Mobiles (Portrait)
  ##Screen = B/w 320px to 479px
*/
@media (min-width: 320px) and (max-width: 480px) {
  #main {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, minmax(1fr, 75px)) 5fr;
    grid-template-areas:
      ". shopping-label shopping-label ."
      "store-label store-label store-input store-input"
      "date-label date-label date-input date-input"
      ". . . submit-list"
      "shopping-list shopping-list shopping-list shopping-list";
  }

  #fab-container {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr;
    grid-template-areas: ". . . add-item";
  }
}
</style>  