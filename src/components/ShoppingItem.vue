<template>
  <div>
    <form>
      <vue-autosuggest
        :suggestions="filteredItemOptions"
        :limit="10"
        :input-props="itemProps"
        :render-suggestion="renderSuggestion"
        @input="onItemInputChanged"
        @selected="onItemSelected"
      >
        <template slot="before-input">
          <label>Item Name</label>
        </template>

        <template slot="before-suggestions">
          <p>If you select an item, current Brand and Category will be overriden</p>
        </template>
      </vue-autosuggest>
      <vue-autosuggest
        v-model="brandQuery"
        :suggestions="filteredBrandOptions"
        :limit="10"
        :input-props="brandProps"
        :render-suggestion="renderSuggestion"
        @input="onBrandInputChanged"
        @selected="onBrandSelected"
      >
        <template slot="before-input">
          <label>Brand</label>
        </template>
      </vue-autosuggest>
      <br />
      <vue-autosuggest
        v-model="categoryQuery"
        :suggestions="filteredCategoryOptions"
        :limit="10"
        :input-props="categoryProps"
        :render-suggestion="renderSuggestion"
        @input="onCategoryInputChanged"
        @selected="onCategorySelected"
      >
        <template slot="before-input">
          <label>Category</label>
        </template>
      </vue-autosuggest>
      <br />
      <label>Quantity</label>
      <input
        v-model="quantity"
        type="number"
        step="any"
        @keyup="$emit('update:quantity', quantity)"
      />
      <br />
      <label>Unit Price</label>
      <input
        v-model="unitPrice"
        type="number"
        step="any"
        @keyup="$emit('update:unitPrice', unitPrice)"
      />
      <br />
      <label>Total Price</label>
      <input readonly disabled :value="totalPrice" />
    </form>
    <br />
  </div>
</template>

<script>
import { VueAutosuggest } from "vue-autosuggest";
import axios from "axios";
import { baseUrl } from "../constants";

export default {
  name: "ShoppingItem",
  props: ["id"],
  data: () => {
    return {
      name: null,
      brand: null,
      brandQuery: "",
      category: null,
      categoryQuery: "",
      quantity: null,
      unitPrice: null,
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
      return this.quantity * this.unitPrice;
    }
  },
  methods: {
    onBrandSelected(option) {
      if (option == null) return;
      this.brand = option.item;
      console.log(option);
      this.$emit("update:brand", this.brand);
    },
    onBrandInputChanged(text) {
      if (text === "" || text === undefined) {
        return;
      }
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
    onCategorySelected(option) {
      if (option == null) return;
      this.category = option.item;
      console.log(option);
      this.$emit("update:category", this.category);
    },
    onCategoryInputChanged(text) {
      if (text === "" || text === undefined) {
        return;
      }
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
    onItemSelected(option) {
      if (option == null || option.item == null) return;
      let selectedItem = option.item;
      this.name = selectedItem.name;
      this.$emit("update:name", this.name);

      if (selectedItem.category != null) {
        this.categoryQuery = selectedItem.category.name;
        this.category = selectedItem.category;
        this.$emit("update:category", selectedItem.category);
      }

      if (selectedItem.brand != null) {
        this.brandQuery = selectedItem.brand.name;
        this.brand = selectedItem.brand;
        this.$emit("update:brand", selectedItem.brand);
      }
    },
    onItemInputChanged(text) {
      if (text === "" || text === undefined) {
        return;
      }
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
    renderSuggestion(suggestion) {
      return suggestion.item.name;
    }
  },
  components: {
    VueAutosuggest
  }
};
</script>

<style scoped>
#brand_input {
  outline: none;
  position: relative;
  display: block;
  font-family: monospace;
  font-size: 20px;
  border: 1px solid #616161;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}

#brand_input.autosuggest__input-open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.autosuggest__results-container {
  position: relative;
  width: 100%;
}

.autosuggest__results {
  font-weight: 300;
  margin: 0;
  position: absolute;
  z-index: 10000001;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  background: white;
  padding: 0px;
  overflow: scroll;
  max-height: 200px;
}

.autosuggest__results ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.autosuggest__results .autosuggest__results_item {
  cursor: pointer;
  padding: 15px;
}

#autosuggest ul:nth-child(1) > .autosuggest__results_title {
  border-top: none;
}

.autosuggest__results .autosuggest__results_title {
  color: gray;
  font-size: 11px;
  margin-left: 0;
  padding: 15px 13px 5px;
  border-top: 1px solid lightgray;
}

.autosuggest__results .autosuggest__results_item:active,
.autosuggest__results .autosuggest__results_item:hover,
.autosuggest__results .autosuggest__results_item:focus,
.autosuggest__results.autosuggest__results_item.autosuggest__results_item-highlighted {
  background-color: #ddd;
}
</style>