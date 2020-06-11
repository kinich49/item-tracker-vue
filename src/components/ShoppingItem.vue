<template>
  <v-card class="main-item-container">
    <label id="name-label">Item</label>
    <vue-autosuggest
      v-model="item.name"
      :suggestions="filteredItemOptions"
      :limit="10"
      :input-props="itemProps"
      :render-suggestion="renderSuggestion"
      @input="onItemInputChanged"
      @selected="onItemSelected"
      id="name-input"
    >
      <template slot="before-suggestions">
        <p>If you select an item, current Brand and Category will be overriden</p>
      </template>
    </vue-autosuggest>
    <v-expand-transition>
      <div class="item-details-container" v-show="expand">
        <label id="brand-label">Brand</label>
        <vue-autosuggest
          v-model="item.brand.name"
          :suggestions="filteredBrandOptions"
          :limit="10"
          :input-props="brandProps"
          :render-suggestion="renderSuggestion"
          @input="onBrandInputChanged"
          @selected="onBrandSelected"
          id="brand-input"
        />

        <label id="category-label">Category</label>
        <vue-autosuggest
          v-model="item.category.name"
          :suggestions="filteredCategoryOptions"
          :limit="10"
          :input-props="categoryProps"
          :render-suggestion="renderSuggestion"
          @input="onCategoryInputChanged"
          @selected="onCategorySelected"
          id="category-input"
        />

        <label id="quantity-label">Quantity</label>
        <input
          v-model.number="item.quantity"
          type="number"
          step="any"
          @keyup="$emit('update:item', item)"
          id="quantity-input"
        />
        <v-select v-model="item.unit" :options="['KG', 'Unit']" id="quantity-unit-input"></v-select>

        <label id="unit-price-label">Unit Price</label>
        <input
          v-model.number="item.unitPrice"
          type="number"
          step="any"
          @keyup="$emit('update:item', item)"
          id="unit-price-input"
          placeholder="How much did it cost?"
        />
        <v-divider insent id="divider"></v-divider>
      </div>
    </v-expand-transition>

    <label id="total-price-label">Total</label>
    <input readonly disabled :value="totalPrice" id="total-price-input" />
    <v-card-actions id="actions">
      <v-btn icon @click="expand = !expand">
        <v-icon>{{ expand ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { VueAutosuggest } from "vue-autosuggest";
import vSelect from "vue-select";
import axios from "axios";
import { baseUrl } from "../constants";
import "vue-select/dist/vue-select.css";

export default {
  name: "ShoppingItem",
  data: () => {
    return {
      item: {
        id: null,
        name: null,
        category: {
          id: null,
          name: null
        },
        brand: {
          id: null,
          name: null
        },
        quantity: null,
        unitPrice: null,
        unit: "",
        currency: "MXN"
      },
      filteredBrandOptions: [],
      brandProps: {
        id: "brand_input",
        placeholder: "Item's brand..."
      },
      filteredCategoryOptions: [],
      categoryProps: {
        id: "autosuggest__category_input",
        placeholder: "Item's category..."
      },
      filteredItemOptions: [],
      itemProps: {
        id: "autosuggest__item_input",
        placeholder: "What did you buy?."
      },
      limit: 10,
      expand: false,
      formatter: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
      })
    };
  },
  computed: {
    totalPrice() {
      if (!this.item || !this.item.unitPrice || !this.item.quantity) {
        return null;
      }
      return this.formatter.format(this.item.unitPrice * this.item.quantity);
    }
  },
  methods: {
    onItemInputChanged(text) {
      if (text === "" || text === undefined) {
        return;
      }
      this.item.id = null;
      let url = `${baseUrl}/items?name=${text}`;
      axios
        .get(url)
        .then(result => {
          this.filteredItemOptions = [
            {
              data: result.data
            }
          ];
        })
        .catch(error => console.log(error));
    },
    onItemSelected(option) {
      if (option == null || option.item == null) return;
      const selectedItem = option.item;
      this.item.name = selectedItem.name;
      this.item.id = selectedItem.id;

      if (selectedItem.brand == null) {
        this.item.brand = {
          id: null,
          name: null
        };
      } else {
        this.item.brand = selectedItem.brand;
      }

      if (selectedItem.category == null) {
        this.item.category = {
          id: null,
          name: null
        };
      } else {
        this.item.category = selectedItem.category;
      }

      this.$emit("update:item", this.item);
    },
    onBrandInputChanged(text) {
      if (text === "" || text === undefined) {
        return;
      }
      this.item.brand.id = null;
      let url = `${baseUrl}/brands?name=${text}`;
      axios
        .get(url)
        .then(result => {
          this.filteredBrandOptions = [
            {
              data: result.data
            }
          ];
        })
        .catch(error => console.log(error));
    },
    onBrandSelected(option) {
      if (option == null) return;
      this.item.brand = option.item;
      this.$emit("update:item", this.item);
    },
    onCategoryInputChanged(text) {
      if (text === "" || text === undefined) {
        return;
      }
      this.item.category.id = null;
      let url = `${baseUrl}/categories?name=${text}`;
      axios
        .get(url)
        .then(result => {
          this.filteredCategoryOptions = [
            {
              data: result.data
            }
          ];
        })
        .catch(error => console.log(error));
    },
    onCategorySelected(option) {
      if (option == null) return;
      this.item.category = option.item;
      this.$emit("update:item", this.item);
    },
    renderSuggestion(suggestion) {
      return suggestion.item.name;
    }
  },
  components: {
    VueAutosuggest,
    vSelect
  }
};
</script>

<style scoped>
input[type="number"] {
  -moz-appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.main-item-container {
  display: grid;
}

.item-details-container {
  display: grid;
}

#name-label {
  margin-left: 1em;
  grid-area: item-name-label;
}

#name-input {
  grid-area: item-name-input;
}

#brand-label {
  margin-left: 1em;
  grid-area: brand-label;
}

#brand-iput {
  grid-area: brand-input;
}

#category-label {
  margin-left: 1em;
  grid-area: category-label;
}

#category-input {
  grid-area: category-input;
}

#quantity-label {
  margin-left: 1em;
  grid-area: quantity-label;
}

#quantity-input {
  grid-area: quantity-input;
}

#quantity-unit-input {
  grid-area: quantity-unit-input;
  margin-right: 1em;
}

#unit-price-label {
  margin-left: 1em;
  grid-area: unit-price-label;
}

#unit-price-input {
  grid-area: unit-price-input;
}

#total-price-label {
  margin-left: 1em;
  grid-area: total-price-label;
}

#total-price-input {
  grid-area: total-price-input;
}

#divider {
  margin-right: 1em;
  grid-area: divider;
}
#actions {
  grid-area: chevron;
  justify-self: end;
}

/* 
  ##Device = Desktops
  ##Screen = 1281px to higher resolution desktops
*/
@media (min-width: 1281px) {
  .main-item-container {
    padding-top: 1em;
    grid-template-columns: repeat(8, minmax(50px, 1fr));
    grid-template-areas:
      "item-name-label item-name-input item-name-input . . . . . "
      "item-details item-details item-details item-details item-details item-details item-details item-details"
      "total-price-label total-price-input total-price-input . . . . ."
      ". . . . . . . chevron";
  }

  .item-details-container {
    grid-template-columns: repeat(8, minmax(50px, 1fr));
    grid-template-areas:
      "brand-label brand-input brand-input . category-label category-input category-input ."
      "quantity-label quantity-input quantity-unit-input quantity-unit-input unit-price-label unit-price-input unit-price-input ."
      ". divider divider divider divider divider divider .";
    grid-area: item-details;
  }
}

/* 
  ##Device = Most of the Smartphones Mobiles (Portrait)
  ##Screen = B/w 320px to 479px
*/

@media (min-width: 320px) and (max-width: 480px) {
  .main-item-container {
    padding-top: 1em;
    grid-template-columns: repeat(4, minmax(50px, 1fr));
    grid-template-areas:
      "item-name-label item-name-input item-name-input ."
      "item-details item-details item-details item-details"
      "total-price-label total-price-input . ."
      ". . . chevron";
  }

  .item-details-container {
    grid-template-columns: repeat(4, minmax(50px, 1fr));
    grid-template-areas:
      "brand-label brand-input brand-input ."
      "category-label category-input category-input ."
      "quantity-label quantity-input quantity-unit-input . "
      "unit-price-label unit-price-input unit-price-input ."
      ". divider divider divider";
    grid-area: item-details;
  }
}
</style>