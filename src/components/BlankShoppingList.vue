<template>
  <div>
    <div id="main">
      <h1 id="shopping-label">Shopping Receipt</h1>
      <v-combobox
        class="shopping-store-input"
        v-model.lazy="storeSelection"
        :items="storeSuggestions"
        label="Store"
        :search-input.sync="storeSearch"
        placeholder="Where did you shop?"
        hide-no-data
        clearable
      ></v-combobox>
      <input id="shopping-date-input" v-model="shoppingDate" type="date" > 
      <v-btn
        color="primary"
        tile
        id="submit-shopping-list"
        @click="submitShoppingList()"
        >Save</v-btn
      >
      <div id="empty-message-container" v-if="shoppingItems.length <= 0">
        <p id="empty-message">No items yet. Try adding something!</p>
      </div>

      <div v-else id="shopping-list">
        <ShoppingItemComponent
          v-for="shoppingItem in shoppingItems"
          v-bind:key="shoppingItem.shoppingItemKey"
          v-bind:itemname.sync="shoppingItem.item.name"
          v-bind:itemid.sync="shoppingItem.item.id"
          v-bind:unitprice.sync="shoppingItem.item.unitPrice"
          v-bind:quantity.sync="shoppingItem.item.quantity"
          v-bind:brand.sync="shoppingItem.item.brand"
          v-bind:category.sync="shoppingItem.item.category"
          v-bind:unit.sync="shoppingItem.item.unit"
          v-on:dismiss-item="removeItem(shoppingItem)"
        />
      </div>
    </div>
    <div id="fab-container">
      <v-btn
        fab
        id="shopping-add-item"
        color="primary"
        v-on:click="addBlankShoppingItem()"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">

import axios from "axios";
import defaultAuth, { baseUrl } from "../constants";
import { Component, Vue, Watch } from "vue-property-decorator";
import { StoreSuggestion } from "@/models/RequestUnionResponse"
import ShoppingItemComponent from "./ShoppingItem.vue"
import { ShoppingItem, Store, ShoppingList } from "@/models/Requests"
import JsonApi from "@/models/JsonApi"

interface ShoppingItemWrapper {
  shoppingItemKey: number,
  item: ShoppingItem
}

@Component({
  components: {
    ShoppingItemComponent
  }
})
export default class BlankShoppingListComponent extends Vue {

  shoppingDate: string = "";
  shoppingItems: ShoppingItemWrapper[] = [];
  storeSearch: string = "";
  storeSuggestions: StoreSuggestion[] = [];
  storeSelection: StoreSuggestion = null;
  maxShoppingItemKey: number = 0;

  private getStoreSuggestions(stores: Store[]): StoreSuggestion[] {
    return stores.map(store => {
      return {
        text: store.name ?? "",
        value: store
      }
    })
  }

  removeItem(shoppingItem: ShoppingItemWrapper): void {
      const index = this.shoppingItems.indexOf(shoppingItem);
      if (index > -1) {
        this.shoppingItems.splice(index, 1);
      }
  }
  
  isReadyToSubmit(): boolean {
    return true;
  }

  addBlankShoppingItem() {
    let shoppingItem: ShoppingItemWrapper = {
      shoppingItemKey: this.maxShoppingItemKey,
      item: {
        name: "",
        id: null,
        unitPrice: 0,
        quantity: 0,
        brand: null,
        category: null,
        unit: "Unit",
        currency: "MXN",
      },
    };
    this.shoppingItems.push(shoppingItem);
    this.maxShoppingItemKey += 1;
  }

  submitShoppingList() {
    if (!this.isReadyToSubmit()) {
      return;
    }

    let elements: Array<ShoppingItem> = this.shoppingItems.map((i) => i.item);
    let date = new Date(this.shoppingDate)

    const shoppingList: ShoppingList = {
      shoppingDate: date,
      store: this.storeSelection.value,
      shoppingItems: elements,
    };

    const url = `${baseUrl}/shoppingLists`;
    axios
      .post(url, shoppingList, {
        auth: defaultAuth,
      })
      .then(() => {
        this.$router.push("/");
      })
      .catch(() => {});
  }

  @Watch("storeSearch")
  onStoreSearchPropertyChanged(newValue: string) {
    if (newValue === "" || newValue == null) {
      this.storeSuggestions = []
      console.log("onStoreSearchPropertyChanged test")
      return;
    }

    let url = `${baseUrl}/stores?name=${newValue}`;

    axios
      .get<JsonApi<Store[]>>(url, {
        auth: defaultAuth,
      })
      .then((result) => {
        if (result.status == 200) {
            this.storeSuggestions  = this.getStoreSuggestions(result.data.data);
          } else {
            let newStoreChoice: Store = {
              id: null,
              name: newValue
            };
            this.storeSuggestions = this.getStoreSuggestions([newStoreChoice])
          }
      })
      .catch(() => {});
  }

  mounted() {
    console.log("created")
    this.shoppingDate = this.parseDate(new Date())
  }

  private parseDate(date: Date): string{
    return date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, "0") +
    '-' + date.getDate().toString().padStart(2, "0");
  }

}

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