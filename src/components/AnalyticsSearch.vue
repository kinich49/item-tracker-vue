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
      item: null,
      analytics: [],
      filteredItemOptions: [],
      itemProps: {
        id: "autosuggest__store_input",
        placeholder: "Search for item..."
      }
    };
  },
  methods: {
    onItemInputChanged(text) {
      let url = `${baseUrl}/items?name=${text}`;
      axios
        .get(url)
        .then(response => {
          console.log(response);
          this.filteredItemOptions = [
            {
              data: response.data
            }
          ];
        })
        .catch(error => console.log(error));
    },

    onItemSelected(option) {
      this.item = option.item;
      let url = `${baseUrl}/items/${this.item.id}/analytics`;
      axios
        .get(url)
        .then(response => {
          let nextIndex = this.analytics.length + 1;
          let newAnalytics = {
            index: nextIndex,
            item: this.item,
            analytics: {
              latestStoreAndDate: `${response.data.latestStore} on ${response.data.latestDate}`,
              latestPrice: response.data.latestPrice,
              averagePrice: response.data.averagePrice
            }
          };
          console.log(newAnalytics);
          this.analytics.push(newAnalytics);
        })
        .catch(() => {});
    },

    renderSuggestion(suggestion) {
      return suggestion.item.name;
    }
  },

  components: {
    ShoppingItemAnalytics,
    VueAutosuggest
  }
};
</script>