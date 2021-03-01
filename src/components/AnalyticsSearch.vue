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
      <ShoppingItemAnalyticsComponent
        v-for="analytic in analytics"
        v-bind:key="analytic.index"
        :analytics="analytic.analytics"
        :item="analytic.item"
      />
    </div>
  </div>
</template>

<script>
import ShoppingItemAnalyticsComponent from "./ShoppingItemAnalytics";
import axios from "axios";
import defaultAuth, { baseUrl } from "../constants";

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
        .get(url, {
          auth: defaultAuth
        })
        .then(response => {
          if (response.data.data) this.entries = response.data.data;
        })
        .catch(() => {});
    },
    selection(selection) {
      let url = this.getAnalyticsUrl(selection);
      this.analytics = [];
      axios
        .get(url, {
          auth: defaultAuth
        })
        .then()
        .then(response => {
          let data = response.data.data;
          data.forEach(element => {
            let nextIndex = this.currentIndex++;
            let newAnalytics = {
              index: nextIndex,
              analytics: {
                latestStoreAndDate: `${element.latestStore} on ${element.latestDate}`,
                latestPrice: element.latestPrice,
                averagePrice: element.averagePrice,
                item: element.item
              }
            };
            this.analytics.push(newAnalytics);
          });
        })
        .catch(() => {});
    }
  },
  components: {
    ShoppingItemAnalyticsComponent
  }
};
</script>

<style scoped>
#main {
  display: grid;
  padding-top: 1em;
  grid-template-columns: 1fr repeat(2, minmax(150px, 3fr)) 1fr;
  grid-template-rows: repeat(2, minmax(1fr, 75px)) 5fr;
}

#title {
  grid-column: 2 / 4;
  text-align: center;
}

.search-input {
  grid-column: 2 / 4;
  grid-row-start: 2;
  max-width: 400px;
  min-width: 300px;
  place-self: center;
}

#search-results {
  grid-column: 2 / 4;
  grid-row-start: 3;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  justify-items: center;
}

/* 
  ##Device = Laptops, Desktops
  ##Screen = B/w 1025px to 1280px

  or

  ##Device = Desktops
  ##Screen = 1281px to higher resolution desktops
*/
/* @media (min-width: 1025px) and (max-width: 1280px), (min-width: 1281px) {

} */

/* 
  ##Device = Tablets, Ipads (portrait)
  ##Screen = B/w 768px to 1024px
*/

/* @media (min-width: 768px) and (max-width: 1024px) {

} */

/*  ##Device = Most of the Smartphones Mobiles (Portrait)
  ##Screen = B/w 320px to 479px

  or

  ##Device = Low Resolution Tablets, Mobiles (Landscape)
  ##Screen = B/w 481px to 767px
*/
@media (min-width: 320px) and (max-width: 480px),
  (min-width: 481px) and (max-width: 767px) {
  .search-input {
    grid-column: 2 / 4;
  }
}
</style>