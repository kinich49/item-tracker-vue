<template>
  <v-card class="main-item-container">
    <v-combobox
      v-model="itemSelection"
      class="item-input"
      :items="items"
      :search-input.sync="itemSearch"
      label="Item"
      placeholder="What did you buy?"
      hint="If you select an item, Brand and Category will be overriden"
      hide-no-data
      clearable
    />
    <v-expand-transition>
      <div class="item-details-container" v-show="expand">
        <v-combobox
          v-model="brandSelection"
          class="brand-input"
          :items="brandItems"
          :search-input.sync="brandSearch"
          label="Brand"
          placeholder="Search a brand..."
          hide-no-data
          clearable
        />

        <v-combobox
          v-model="categorySelection"
          class="category-input"
          :items="categoryItems"
          :search-input.sync="categorySearch"
          label="Category"
          placeholder="Search a category..."
          hide-no-data
          clearable
        />
        <v-text-field
          class="unit-price-input"
          v-model.number="unitPrice"
          label="Unit Price"
          placeholder="What's the price?"
        />
        <v-text-field label="Quantity" v-model.number="quantity" class="quantity-input" />
        <v-select class="quantity-unit-input" v-model="unit" :items="['KG','Unit']" label="Unit"></v-select>
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
import axios from "axios";
import defaultAuth, { baseUrl } from "../constants";
import _ from "lodash-es";

export default {
  name: "ShoppingItem",
  data: () => {
    return {
      expand: true,
      itemSearch: null,
      itemSelection: null,
      itemEntries: null,
      categorySearch: null,
      categorySelection: null,
      categoryEntries: null,
      brandSearch: null,
      brandSelection: null,
      brandEntries: null,
      quantity: null,
      unitPrice: null,
      unit: "Unit",
      formatter: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
      })
    };
  },
  computed: {
    totalPrice() {
      if (_.isNil(this.unitPrice) || _.isNil(this.quantity)) {
        return null;
      }
      return this.formatter.format(this.unitPrice * this.quantity);
    },
    items() {
      if (!this.itemEntries || this.itemEntries.length == 0) return [];

      return this.itemEntries.map(itemEntry => {
        return {
          text: itemEntry.name,
          value: itemEntry
        };
      });
    },
    categoryItems() {
      if (!this.categoryEntries || this.categoryEntries.length == 0) return [];

      return this.categoryEntries.map(categoryEntry => {
        return {
          text: categoryEntry.name,
          value: categoryEntry
        };
      });
    },
    brandItems() {
      if (!this.brandEntries || this.brandEntries.length == 0) return [];

      return this.brandEntries.map(brandEntry => {
        return {
          text: brandEntry.name,
          value: brandEntry
        };
      });
    },
    item() {
      if (_.isNil(this.itemSelection)) return null;

      let itemId = null;
      let itemName = null;
      let brand = null;
      let category = null;
      let isNew = false;

      if (_.isString(this.itemSelection)) {
        itemName = this.itemSelection;
        isNew = true;
      } else if (!_.isNil(this.itemSelection.value)) {
        itemId = this.itemSelection.value.id;
        itemName = this.itemSelection.value.name;
        brand = this.itemSelection.value.brand;
        category = this.itemSelection.value.category;
      }

      let item = {
        id: itemId,
        isNew: isNew,
        name: itemName,
        unit: this.unit,
        brand: brand,
        category: category,
        currency: "MXN"
      };
      return item;
    },
    category() {
      if (!this.categorySelection) return null;

      let category;
      if (_.isString(this.categorySelection)) {
        category = {
          id: null,
          name: this.categorySelection
        };
      } else {
        category = this.categorySelection.value;
      }
      return category;
    },
    brand() {
      if (!this.brandSelection) return null;

      let brand;
      if (_.isString(this.brandSelection)) {
        brand = {
          id: null,
          name: this.brandSelection
        };
      } else {
        brand = this.brandSelection.value;
      }
      return brand;
    }
  },
  watch: {
    itemSearch(text) {
      if (!text || !text.trim()) {
        return;
      }
      let url = `${baseUrl}/items?name=${text}`;
      axios
        .get(url, {
          auth: defaultAuth
        })
        .then(result => {
          this.itemEntries = result.data.data;
        })
        .catch(error => console.log(error));
    },
    categorySearch(text) {
      if (!text || !text.trim()) {
        return;
      }
      let url = `${baseUrl}/categories?name=${text}`;
      axios
        .get(url, {
          auth: defaultAuth
        })
        .then(result => {
          this.categoryEntries = result.data.data;
        })
        .catch(error => console.log(error));
    },
    brandSearch(text) {
      if (!text || !text.trim()) {
        return;
      }
      let url = `${baseUrl}/brands?name=${text}`;
      axios
        .get(url, {
          auth: defaultAuth
        })
        .then(result => {
          this.brandEntries = result.data.data;
        })
        .catch(error => console.log(error));
    },
    item() {
      if (_.isNil(this.item)) {
        this.brandSelection = null;
        this.categorySelection = null;
        this.$emit("update:itemname", null);
        this.$emit("update:itemid", null);
        return;
      }

      if (!_.isNil(this.item.brand)) {
        this.brandSelection = {
          text: this.item.brand.name,
          value: this.item.brand
        };
      }

      if (!_.isNil(this.item.category)) {
        this.categorySelection = {
          text: this.item.category.name,
          value: this.item.category
        };
      }
      this.$emit("update:itemname", this.item.name);
      this.$emit("update:itemid", this.item.id);
    },
    unitPrice() {
      this.$emit("update:unitprice", this.unitPrice);
    },
    quantity() {
      this.$emit("update:quantity", this.quantity);
    },
    category() {
      this.$emit("update:category", this.category);
    },
    brand() {
      this.$emit("update:brand", this.brand);
    }
  }
};
</script>

<style scoped>
.main-item-container {
  display: grid;
}

.item-details-container {
  display: grid;
}

.item-input {
  grid-area: item-input;
}

.brand-input {
  grid-area: brand-input;
}

.category-input {
  grid-area: category-input;
}

.quantity-input {
  grid-area: quantity-input;
}

.quantity-unit-input {
  grid-area: quantity-unit-input;
}

.unit-price-input {
  grid-area: unit-price-input;
}

#total-price-label {
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
  ##Device = Laptops, Desktops
  ##Screen = B/w 1025px to 1280px
  or

  ##Device = Desktops
  ##Screen = 1281px to higher resolution desktops
*/
@media (min-width: 1025px) and (max-width: 1280px), (min-width: 1281px) {
  .main-item-container {
    padding: 1em;
    grid-template-columns: repeat(8, minmax(50px, 1fr));
    grid-template-areas:
      "item-input item-input item-input item-input item-input item-input . ."
      "item-details item-details item-details item-details item-details item-details item-details item-details"
      "total-price-label total-price-input total-price-input . . . . ."
      ". . . . . . . chevron";
  }

  .item-details-container {
    grid-template-columns: repeat(6, minmax(50px, 1fr));
    grid-template-areas:
      "brand-input brand-input brand-input category-input category-input category-input "
      "unit-price-input unit-price-input quantity-input quantity-input quantity-unit-input quantity-unit-input ";
    grid-area: item-details;
    gap: 1em;
  }
}

/* 
  ##Device = Tablets, Ipads (portrait)
  ##Screen = B/w 768px to 1024px
*/
@media (min-width: 768px) and (max-width: 1024px) {
  .main-item-container {
    padding-top: 1em;
    padding-left: 1em;
    padding-right: 1em;
    grid-template-columns: repeat(4, minmax(50px, 1fr));
    grid-template-areas:
      "item-input item-input item-input item-input"
      "item-details item-details item-details item-details"
      "total-price-label total-price-input . ."
      ". . . chevron";
  }

  .item-details-container {
    grid-area: item-details;
    grid-template-columns: repeat(4, 1fr);
    grid-template-areas:
      " brand-input brand-input category-input category-input"
      " quantity-input quantity-unit-input . ."
      " unit-price-input . . .";
    gap: 0.5em;
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
  .main-item-container {
    padding-top: 1em;
    padding-left: 1em;
    padding-right: 1em;
    grid-template-columns: repeat(4, minmax(50px, 1fr));
    grid-template-areas:
      "item-input item-input item-input item-input"
      "item-details item-details item-details item-details"
      "total-price-label total-price-input . ."
      ". . . chevron";
  }

  .item-details-container {
    grid-area: item-details;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas:
      " brand-input brand-input brand-input"
      " category-input category-input category-input"
      " quantity-input quantity-unit-input ."
      " unit-price-input unit-price-input .";
    gap: 1em;
  }
}
</style>