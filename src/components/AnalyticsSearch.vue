<template>
  <div id="main">
    <h1 id="title">Analytics</h1>
    <v-combobox
      class="search-input"
      v-model="selection"
      :items="suggestions"
      :search-input.sync="analyticsSearch"
      hide-no-data
      placeholder="Search for an item, brand or category"
      clearable
    ></v-combobox>
    <div id="search-results">
      <ShoppingItemAnalyticsComponent
        v-for="analytic in analytics"
        v-bind:key="analytic.index"
        :analytics="analytic.data"
        :item="analytic.item"
      />
    </div>
  </div>
</template>

<script lang="ts">
import ShoppingItemAnalyticsComponent from "./ShoppingItemAnalytics.vue";
import axios from "axios";
import defaultAuth, { baseUrl } from "../constants";
import { Component, Vue, Watch } from "vue-property-decorator";
import { ComboBoxSuggestion } from "@/models/ComboBoxSuggestion";
import { Item, AnalyticsModel, SuggestionModel } from "@/models/Responses";
import { ItemImpl, BrandImpl, CategoryImpl } from "@/models/Analytics";
import JsonApi from "@/models/JsonApi";

type ElementImpl = ItemImpl | BrandImpl | CategoryImpl;
interface Analytics {
  index: number;
  data: {
    latestPrice: string;
    latestStoreAndDate: string;
    averagePrice: string;
    item: Item;
  };
}

@Component({
  components: {
    ShoppingItemAnalyticsComponent,
  },
})
export default class AnalyticsSearchComponent extends Vue {
  analytics: Analytics[] = [];
  suggestionResponse: SuggestionModel = null;
  currentIndex: number = 0;
  analyticsSearch: string = "";
  selection: ComboBoxSuggestion<ElementImpl> = null;

  getAnalyticsUrl(selection: ElementImpl): string {
    return `${baseUrl}/${selection.path}`;
  }

  get suggestions(): ComboBoxSuggestion<ElementImpl>[] {
    if (this.suggestionResponse == null ) return [];

    let suggestions: ComboBoxSuggestion<ElementImpl>[] = [];
    this.transform(this.suggestionResponse, suggestions);

    return suggestions;
  }

  @Watch("analyticsSearch")
  search(newValue: string) {
    if (newValue == null || newValue == "") return;

    let url = `${baseUrl}/suggestions?name=${newValue}`;
    axios
      .get<JsonApi<SuggestionModel>>(url, {
        auth: defaultAuth,
      })
      .then((response) => {
        if (response.status == 200) {
          this.suggestionResponse = response.data.data;
        } else this.suggestionResponse = null;
      });
  }

  @Watch("selection")
  onSelectionPropertyChanged(newValue: ComboBoxSuggestion<ElementImpl>) {
    if (newValue == null || newValue.value == null) return;
    let url = this.getAnalyticsUrl(newValue.value);

    this.analytics = [];
    axios
      .get<JsonApi<AnalyticsModel[]>>(url, {
        auth: defaultAuth,
      })
      .then()
      .then((response) => {
        let data = response.data.data;
        data.forEach((element) => {
          let nextIndex: number = this.currentIndex++;
          let newAnalytics: Analytics = {
            index: nextIndex,
            data: {
              latestStoreAndDate: `${element.latestStore} on ${element.latestDate}`,
              latestPrice: element.latestPrice,
              averagePrice: element.averagePrice,
              item: element.item,
            },
          };
          this.analytics.push(newAnalytics);
        });
      })
      .catch(() => {});
  }

  private transform(
    suggestion: SuggestionModel,
    accumulator: ComboBoxSuggestion<ElementImpl>[]
  ): void {
    suggestion.items?.forEach((item) => {
      let itemImpl = new ItemImpl(item);
      let suggestion: ComboBoxSuggestion<ElementImpl> = {
        text: `Item: ${itemImpl.name}`,
        value: itemImpl,
      };
      accumulator.push(suggestion);
    });

    suggestion.categories?.forEach((category) => {
      let categoryImpl = new CategoryImpl(category);
      let suggestion: ComboBoxSuggestion<ElementImpl> = {
        text: `Category: ${categoryImpl.name}`,
        value: categoryImpl,
      };
      accumulator.push(suggestion);
    });

    suggestion.brands?.forEach((brand) => {
      let brandImpl = new BrandImpl(brand);
      let suggestion: ComboBoxSuggestion<ElementImpl> = {
        text: `Brand: ${brandImpl.name}`,
        value: brandImpl,
      };
      accumulator.push(suggestion);
    });
  }
}
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