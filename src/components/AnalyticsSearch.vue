<template>
  <div>
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
    </vue-autosuggest>
    <ShoppingItemAnalytics
      v-for="analytic in analytics"
      v-bind:key="analytic.index"
      :analytics="analytic.analytics"
      :item="analytic.item"
    />
  </div>
</template>

<script>
import ShoppingItemAnalytics from "./ShoppingItemAnalytics";
import { VueAutosuggest } from "vue-autosuggest";
import axios from "axios";
import { baseUrl } from "../constants";

export default {
  name: "AnalyticsSearch",
  data() {
    return {
      analytics: [],
      filteredItemOptions: [],
      itemProps: {
        id: "autosuggest__store_input",
        placeholder: "Search for item..."
      },
      currentIndex: 0
    };
  },
  methods: {
    onItemInputChanged(text) {
      if (text === null || text === "") return;
      let url = `${baseUrl}/suggestions?name=${text}`;
      axios
        .get(url)
        .then(response => {
          this.filteredItemOptions = [
            {
              data: this.mapResponseDataToFilteredData(response.data)
            }
          ];
        })
        .catch(error => console.log(error));
    },

    onItemSelected(option) {
      let url = this.getAnalyticsUrl(option.item);
      axios
        .get(url)
        .then(response => {
          let data = response.data;
          data.forEach(element => {
            let nextIndex = this.currentIndex++;
            let newAnalytics = {
              index: nextIndex,
              item: element.item,
              analytics: {
                latestStoreAndDate: `${element.latestStore} on ${element.latestDate}`,
                latestPrice: element.latestPrice,
                averagePrice: element.averagePrice
              }
            };
            this.analytics.push(newAnalytics);
          });
        })
        .catch(() => {});
    },

    getAnalyticsUrl(item) {
      let type = item.type.toLowerCase();
      let id = item.id;
      let url;
      if (type === "item") {
        url = `${baseUrl}/items/${id}/analytics`;
      } else {
        url = `${baseUrl}/items/${type}/${id}/analytics`;
      }

      return url;
    },

    renderSuggestion(suggestion) {
      let item = suggestion.item;
      return `${item.type} ${item.name}`;
    },

    mapResponseDataToFilteredData(data) {
      if (data === null || data === "" || data.length == 0) return null;

      let filtered = [];
      if (data.categories !== null) {
        data.categories.forEach(category => {
          let filteredCategory = {
            type: "Category",
            id: category.id,
            name: category.name
          };
          filtered.push(filteredCategory);
        });
      }

      if (data.brands !== null) {
        data.brands.forEach(brand => {
          let filteredBrand = {
            type: "Brand",
            id: brand.id,
            name: brand.name
          };
          filtered.push(filteredBrand);
        });
      }

      if (data.items !== null) {
        data.items.forEach(item => {
          let filteredItem = {
            type: "Item",
            id: item.id,
            name: item.name
          };
          filtered.push(filteredItem);
        });
      }
      return filtered;
    }
  },

  components: {
    ShoppingItemAnalytics,
    VueAutosuggest
  }
};
</script>