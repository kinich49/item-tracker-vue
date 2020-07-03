<template>
  <div>
    <div id="main">
      <h1 id="shopping-label">Shopping Receipt</h1>
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
      <input id="shopping-date-input" v-model="shoppingDate" type="date" />
      <v-btn color="primary" tile id="submit-shopping-list" v-on:click="submitShoppingList()">Save</v-btn>
      <div id="empty-message-container" v-if="shoppingItems.length <= 0">
        <p id="empty-message">No items yet. Try adding something!</p>
      </div>

      <div v-else id="shopping-list">
        <ShoppingItem
          v-for="shoppingItem in shoppingItems"
          v-bind:key="shoppingItem.index"
          v-bind:itemname.sync="shoppingItem.item.name"
          v-bind:itemid.sync="shoppingItem.item.id"
          v-bind:unitprice.sync="shoppingItem.item.unitPrice"
          v-bind:quantity.sync="shoppingItem.item.quantity"
          v-bind:brand.sync="shoppingItem.item.brand"
          v-bind:category.sync="shoppingItem.item.category"
        />
        <!-- <ShoppingItem v-for="shoppingItem in shoppingItems" v-bind:key="shoppingItem.index" /> -->
      </div>
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
import defaultAuth, { baseUrl } from "../constants";
import _ from "lodash-es";

export default {
  name: "BlankShoppingList",
  data() {
    return {
      shoppingDate: null,
      testBrand: null,
      shoppingItems: [],
      storeSearch: null,
      storeSelection: null,
      storeEntries: null
    };
  },
  computed: {
    items() {
      if (_.isNil(this.storeEntries) || this.storeEntries.length == 0)
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
    isReadyToSumbit() {
      if (!this.storeSelection) return false;
      if (!this.shoppingDate) return false;

      if (!this.shoppingItems || this.shoppingItems.length == 0) return false;

      let isReady = false;
      for (let shoppingItem of this.shoppingItems) {
        isReady = this.isShoppingItemValid(shoppingItem.item);
        if (!isReady) break;
      }
      return isReady;
    },
    isShoppingItemValid(item) {
      return (
        !_.isNil(item) &&
        !_.isNil(item.category) &&
        this.isItemElementNameValid(item) &&
        this.isItemElementNameValid(item.category) &&
        this.isItemNumberValid(item.quantity) &&
        this.isItemNumberValid(item.unitPrice)
      );
    },
    isItemElementNameValid(value) {
      return (
        !_.isNil(value) && !_.isNil(value.name) && !_.isNil(value.name.trim())
      );
    },
    isItemStringValid(value) {
      return !_.isNil(value) && !_.isNil(value.trim());
    },
    isItemNumberValid(value) {
      return !_.isNil(value) && value > 0;
    },

    addBlankShoppingItem() {
      let index = this.shoppingItems.length + 1;
      let shoppingItem = {
        index: index,
        item: {
          name: null,
          id: null,
          unitPrice: null,
          quantity: null,
          brand: null,
          category: null,
          currency: "MXN"
        }
      };
      this.shoppingItems.push(shoppingItem);
    },
    submitShoppingList() {
      console.log(this.isReadyToSumbit());
      if (!this.isReadyToSumbit()) {
        console.log("Something went wrong");
        return;
      }

      let elements = [];

      elements = this.shoppingItems.map(i => i.item);

      const shoppingList = {
        shoppingDate: this.shoppingDate,
        store: this.store,
        shoppingItems: elements
      };
      const url = `${baseUrl}/shoppingLists`;
      axios
        .post(url, shoppingList, {
          auth: defaultAuth
        })
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
        .get(url, {
          auth: defaultAuth
        })
        .then(result => {
          this.storeEntries = result.data.data;
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
  ##Device = Laptops, Desktops
  ##Screen = B/w 1025px to 1280px
  or

  ##Device = Desktops
  ##Screen = 1281px to higher resolution desktops
*/
@media (min-width: 1025px) and (max-width: 1280px), (min-width: 1281px) {
  #main {
    gap: 1em;
    grid-template-columns: 1fr repeat(4, 200px) 1fr;
    grid-template-rows: repeat(4, minmax(1fr, 75px)) 5fr 1fr;
    grid-template-areas:
      " . . shopping-label shopping-label .  ."
      " .  . store-input store-input  . . "
      " .  . date-input  . . . "
      " . . . submit-list . . "
      " . shopping-list shopping-list shopping-list shopping-list . ";
  }

  #fab-container {
    grid-template-columns: 1fr repeat(4, 200px) 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: ". . . . add-item . ";
  }
}

/* 
  ##Device = Tablets, Ipads (portrait)
  ##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) {
  #main {
    gap: 1em;
    grid-template-columns: 1fr repeat(4, minmax(150px, 200px)) 1fr;
    grid-template-rows: repeat(4, minmax(1fr, 75px)) 5fr 1fr;
    grid-template-areas:
      " . . shopping-label shopping-label .  ."
      " .  . store-input store-input  . . "
      " .  . date-input  . . . "
      " . . . . submit-list . "
      " . shopping-list shopping-list shopping-list shopping-list . ";
  }

  #fab-container {
    grid-template-columns: 1fr repeat(4, 200px) 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: ". . . . add-item . ";
  }
}
/* 
  ##Device = Most of the Smartphones Mobiles (Portrait)
  ##Screen = B/w 320px to 479px

  or

  ##Device = Low Resolution Tablets, Mobiles (Landscape)
  ##Screen = B/w 481px to 767px
*/
@media (min-width: 320px) and (max-width: 480px),
  (min-width: 481px) and (max-width: 767px) {
  #main {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, minmax(1fr, 75px)) 5fr;
    grid-template-areas:
      "shopping-label"
      "store-input "
      "date-input"
      "submit-list "
      "shopping-list ";
  }

  #fab-container {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr;
    grid-template-areas: ". . . add-item";
  }
}
</style>  