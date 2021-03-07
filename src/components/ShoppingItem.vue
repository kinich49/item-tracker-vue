<template>
  <v-card class="main-item-container">
    <button
      type="button"
      class="remove-item"
      aria-label="Close"
      @click="$emit('dismiss-item')"
    >
      <span aria-hidden="true">×</span>
    </button>
    <v-combobox
      v-model="itemSelection"
      class="item-input"
      :items="itemSuggestions"
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
          :items="brandSuggestions"
          :search-input.sync="brandSearch"
          label="Brand"
          placeholder="Search a brand..."
          hide-no-data
          clearable
        />

        <v-combobox
          v-model="categorySelection"
          class="category-input"
          :items="categorySuggestions"
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
        <v-text-field
          label="Quantity"
          v-model.number="quantity"
          class="quantity-input"
        />
        <v-select
          class="quantity-unit-input"
          v-model="unit"
          :items="['KG', 'Unit']"
          label="Unit"
        ></v-select>
      </div>
    </v-expand-transition>

    <label id="total-price-label">Total</label>
    <input readonly disabled :value="totalPrice" id="total-price-input" />
    <v-card-actions id="actions">
      <v-btn icon @click="expand = !expand">
        <v-icon>{{ expand ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import axios from "axios";
import defaultAuth, { baseUrl } from "../constants";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Item, Category, Brand } from "@/models/RequestUnionResponse";
import {
  ItemSuggestion,
  CategorySuggestion,
  BrandSuggestion,
} from "@/models/RequestUnionResponse";
import JsonApi from "@/models/JsonApi";

@Component
export default class ShoppingItemComponent extends Vue {
  expand: boolean = true;

  itemSearch: string = "";
  itemSuggestions: ItemSuggestion[] = [];
  itemSelection: ItemSuggestion = null;

  categorySearch: string = "";
  categorySuggestions: CategorySuggestion[] = [];
  categorySelection: CategorySuggestion = null;

  brandSearch: string = "";
  brandSuggestions: BrandSuggestion[] = [];
  brandSelection: BrandSuggestion = null;

  quantity: number = 0;
  unitPrice: number = 0.0;
  unit: string = "Unit";

  readonly formatter: Intl.NumberFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  get totalPrice(): string {
    return this.formatter.format(this.unitPrice * this.quantity);
  }

  private getSuggestions( options: Array<Item | Brand | Category> ): Array<ItemSuggestion | BrandSuggestion | CategorySuggestion> {
    return options.map((option: Item | Brand | Category) => {
      return {
        text: option.name ?? "",
        value: option,
      };
    });
  }

  @Watch("itemSelection")
  onItemSelectionPropertyChanged(newValue: ItemSuggestion): void {
    if (newValue == null) {
      this.categorySelection = null;
      this.brandSelection = null;
      this.$emit("update:itemname", null);
      this.$emit("update:itemid", null);
      return;
    }

    let category: Category = newValue.value.category;
    if (category != null) {
      this.categorySelection = {
        text: category.name,
        value: category,
      };
    } else {
      this.categorySelection = null;
    }

    let brand: Brand = newValue.value.brand;

    if (brand != null) {
      this.brandSelection = {
        text: brand.name,
        value: brand,
      };
    }

    this.$emit("update:itemname", this.itemSelection.value.name);
    this.$emit("update:itemid", this.itemSelection.value.id);
  }

  @Watch("itemSearch")
  onItemSearchChanged(newValue: string): void {
    if (newValue == null) return;

    let url: string = `${baseUrl}/items?name=${newValue}`;

    axios
      .get<JsonApi<Item[]>>(url, {
        auth: defaultAuth,
      })
      .then((result) => {
        if (result.status == 200) {
          this.itemSuggestions = this.getSuggestions(
            result.data.data
          ) as ItemSuggestion[];
        } else {
          let newSuggestion: Item = {
            category: null,
            brand: null,
            currency: "MXN",
            unit: "Unit",
            name: newValue,
          };
          this.itemSuggestions = this.getSuggestions([
            newSuggestion,
          ]) as ItemSuggestion[];
        }
      })
      .catch(() => {});
  }

  @Watch("brandSearch")
  onBrandSearchChanged(newValue: string): void {
    if (newValue == null) return;

    let url: string = `${baseUrl}/brands?name=${newValue}`;

    axios
      .get<JsonApi<Brand[]>>(url, {
        auth: defaultAuth,
      })
      .then((result) => {
        if (result.status == 200) {
          this.brandSuggestions = this.getSuggestions(
            result.data.data
          ) as BrandSuggestion[];
        } else {
          let newSuggestion: Brand = {
            name: newValue,
          };
          this.brandSuggestions = this.getSuggestions([
            newSuggestion,
          ]) as BrandSuggestion[];
        }
      })
      .catch(() => {});
  }

  @Watch("categorySearch")
  onCategorySearchChanged(newValue: string): void {
    if (newValue == null) return;

    let url: string = `${baseUrl}/categories?name=${newValue}`;

    axios
      .get<JsonApi<Category[]>>(url, {
        auth: defaultAuth,
      })
      .then((result) => {
        if (result.status == 200) {
          this.categorySuggestions = this.getSuggestions(
            result.data.data
          ) as CategorySuggestion[];
        } else {
          let newSuggestion: Category = {
            name: newValue,
          };
          this.categorySuggestions = this.getSuggestions([
            newSuggestion,
          ]) as CategorySuggestion[];
        }
      })
      .catch(() => {});
  }

  @Watch("unitPrice")
  onUnitPriceChanged(newValue: number): void {
    this.$emit("update:unitprice", newValue);
  }

  @Watch("quantity")
  onQuantityChanged(newValue: number): void {
    this.$emit("update:quantity", newValue);
  }

  @Watch("categorySelection")
  onCategoryChanged(newValue: CategorySuggestion): void {
    if (newValue == null) this.$emit("update:category", null);
    else this.$emit("update:category", newValue.value);
  }

  @Watch("brandSelection")
  onBrandChanged(newValue: BrandSuggestion): void {
    if (newValue == null) this.$emit("update:brand", null);
    else this.$emit("update:brand", newValue.value);
  }

  @Watch("unit")
  onUnitChanged() {
    this.$emit("update:unit", this.unit);
  }
}
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

.remove-item {
  grid-area: remove-item;
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
      "item-input item-input item-input item-input item-input item-input . remove-item"
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