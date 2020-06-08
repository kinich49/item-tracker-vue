<template>
  <div class="item-container">
    <label class="item-label">Item Name</label>
    <vue-autosuggest
      v-model="item.name"
      :suggestions="filteredItemOptions"
      :limit="10"
      :input-props="itemProps"
      :render-suggestion="renderSuggestion"
      @input="onItemInputChanged"
      @selected="onItemSelected"
      class="item-input"
    >
      <template slot="before-suggestions">
        <p>If you select an item, current Brand and Category will be overriden</p>
      </template>
    </vue-autosuggest>

    <label class="item-label">Brand</label>
    <vue-autosuggest
      v-model="item.brand.name"
      :suggestions="filteredBrandOptions"
      :limit="10"
      :input-props="brandProps"
      :render-suggestion="renderSuggestion"
      @input="onBrandInputChanged"
      @selected="onBrandSelected"
      class="item-input"
    />

    <label class="item-label">Category</label>
    <vue-autosuggest
      v-model="item.category.name"
      :suggestions="filteredCategoryOptions"
      :limit="10"
      :input-props="categoryProps"
      :render-suggestion="renderSuggestion"
      @input="onCategoryInputChanged"
      @selected="onCategorySelected"
      class="item-input"
    />

    <label class="item-label">Quantity</label>
    <input
      v-model.number="item.quantity"
      type="number"
      step="any"
      @keyup="$emit('update:item', item)"
      class="brand-input"
    />
    <v-select v-model="item.unit" :options="['KG', 'Unit']" class="brand-unit-input"></v-select>

    <label class="item-label">Unit Price</label>
    <input
      v-model.number="item.unitPrice"
      type="number"
      step="any"
      @keyup="$emit('update:item', item)"
      class="item-input"
    />

    <label class="item-label">Total Price</label>
    <input readonly disabled :value="totalPrice" class="total-price-input" />
  </div>
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
        placeholder: "Type an item..."
      },
      limit: 10
    };
  },
  computed: {
    totalPrice() {
      if (!this.item || !this.item.unitPrice || !this.item.quantity) {
        return null;
      }

      return this.item.unitPrice * this.item.quantity;
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

.item-container {
  display: grid;
  grid-template-columns: repeat(4, minmax(50px, 1fr));
}

.item-label {
  margin-left: 1em;
  grid-column-start: 1;
  grid-column-end: 3;
}

.item-input {
  grid-column-start: 3;
  grid-column-end: 5;
}

.brand-iput {
  grid-column-start: 3;
  grid-column-end: 4;
}

.brand-unit-input {
  grid-column-start: 4;
  grid-column-end: 5;
}

.total-price-input {
  grid-column-start: 4;
  grid-column-end: 5;
}

</style>