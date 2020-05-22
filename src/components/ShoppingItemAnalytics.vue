<template>
  <div class="card">
    <div class="container">
      <p>
        <strong>{{ item.name }}</strong>
        <br />
        <span>{{ item.brand.name }}</span>
        <br />
        <span>{{ item.category.name }}</span>
      </p>
      <label>
        <strong>Latest Store and Date</strong>
        <br/>
        <span>{{ analytics.latestStoreAndDate }}</span>
      </label>
      <br />
      <label>
        <strong>Latest Price</strong>
        <br/>
        <span>{{ analytics.latestPrice }}</span>
      </label>
      <br />
      <label>
        <strong>Average Price</strong>
        <br/>
        <span>{{ analytics.averagePrice }}</span>
      </label>
    </div>
  </div>
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
.card {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  max-width: 20%;
}

.container {
  padding: 2px 16px;
}
</style>