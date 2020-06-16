<template>
  <v-card outlined id="card" max-width="300">
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline">{{ item.category.name }}</div>
        <v-list-item-title>
          <strong>{{ item.name }}</strong>
        </v-list-item-title>
        <v-list-item-subtitle>{{ item.brand.name }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>
    <label id="first-label">
      <strong>Last bought in:&nbsp;</strong>
      <span>{{ analytics.latestStoreAndDate }}</span>
    </label>

    <label>
      <strong>Latest Price:&nbsp;</strong>
      <span>{{ analytics.latestPrice }}</span>
    </label>

    <label>
      <strong>Average Price:&nbsp;</strong>
      <span>{{ analytics.averagePrice }}</span>
    </label>
  </v-card>
</template>

<script>
export default {
  name: "ShoppingItemAnalytics",
  props: {
    analytics: {
      latestPrice: null,
      latestStoreAndDate: null,
      averagePrice: null
    },
    item: {
      name: null,
      category: null,
      brand: null
    }
  }
};
</script>

<style scoped>
#card {
  display: grid;
  grid-template-rows: repeat(auto-fit, 1fr);
  padding: 12px 24px;
}

#first-label {
  margin-top: 10px;
}


</style>