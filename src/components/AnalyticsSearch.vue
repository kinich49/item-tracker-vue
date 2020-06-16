<template>
  <div id="main">
    <h1 id="title">Analytics</h1>
    <v-autocomplete
      class="search-input"
      v-model="selection"
      :items="items"
      :search-input.sync="search"
      hide-no-data
      placeholder="Search for an item, brand or category"
    ></v-autocomplete>
    <div id="search-results">
      <ShoppingItemAnalytics
        v-for="analytic in analytics"
        v-bind:key="analytic.index"
        :analytics="analytic.analytics"
        :item="analytic.item"
      />
    </div>
  </div>
</template>

<script>
import ShoppingItemAnalytics from "./ShoppingItemAnalytics";
import axios from "axios";
import { baseUrl } from "../constants";

export default {
  name: "AnalyticsSearch",
  data() {
    return {
      analytics: [],
      entries: [],
      currentIndex: 0,
      search: null,
      selection: null
    };
  },
  methods: {
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
    }
  },

  computed: {
    items() {
      if (this.entries === null || this.entries === "") return null;

      let suggestions = [];
      let categories = this.entries.categories;
      if (categories != undefined && categories !== null) {
        categories.forEach(category => {
          let suggestion = {
            text: `Category: ${category.name}`,
            value: {
              type: "Category",
              id: category.id,
              name: category.name
            }
          };
          suggestions.push(suggestion);
        });
      }

      let brands = this.entries.brands;
      if (brands != undefined && brands !== null) {
        brands.forEach(brand => {
          let suggestion = {
            text: `Brand: ${brand.name}`,
            value: {
              type: "Brand",
              id: brand.id,
              name: brand.name
            }
          };
          suggestions.push(suggestion);
        });
      }

      let items = this.entries.items;
      if (items != undefined && items !== null) {
        items.forEach(item => {
          let suggestion = {
            text: `Item: ${item.name}`,
            value: {
              type: "Item",
              id: item.id,
              name: item.name
            }
          };
          suggestions.push(suggestion);
        });
      }
      return suggestions;
    }
  },
  watch: {
    search(text) {
      if (text === null || text === "") return;
      let url = `${baseUrl}/suggestions?name=${text}`;
      axios
        .get(url)
        .then(response => {
          this.entries = response.data;
        })
        .catch(error => console.log(error));
    },
    selection(selection) {
      let url = this.getAnalyticsUrl(selection);
      this.analytics = [];
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
    }
  },
  components: {
    ShoppingItemAnalytics
  }
};
</script>

<style scoped>
#main {
  display: grid;
  padding: 0 24px;
}

#title {
  grid-area: title;
  justify-self: center;
}

.search-input {
  grid-area: search;
}

#search-results {
  grid-area: results;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 24px;
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
    padding-top: 2em;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(2, minmax(75px, 1fr)) 5fr;
    grid-template-areas:
      ". . . . . title title . . . . . "
      ". . search search search . . . . . . ."
      ". . results results results results results results results results . . ";
  }
}

/* 
  ##Device = Tablets, Ipads (portrait)
  ##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) {
  #main {
    padding-top: 1em;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, minmax(1fr, 75px)) 5fr;
    grid-template-areas:
      ". title title  ."
      ". search search ."
      "results results results results";
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
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, minmax(1fr, 75px)) 5fr;
    grid-template-areas:
      ". title title  ."
      "search search search search"
      "results results results results";
  }
}
</style>