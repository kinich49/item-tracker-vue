<template>
  <v-card outlined id="card">
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline">{{ analytics.item.category.name }}</div>
        <v-list-item-title>
          <strong>{{ analytics.item.name }}</strong>
        </v-list-item-title>
        <v-list-item-subtitle v-if="analytics.item.brand != null">{{
          analytics.item.brand.name
        }}</v-list-item-subtitle>
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

<script lang="ts">
import { Analytics } from "@/models/Analytics";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ShoppingItemAnalyticsComponent extends Vue {
  @Prop({ required: true, type: Object as () => Analytics })
  analytics!: Analytics;
}
</script>

<style scoped>
#card {
  display: grid;
  grid-template-rows: repeat(auto-fit, 1fr);
  padding: 12px 24px;
  width: 300px;
}

#first-label {
  margin-top: 10px;
}
</style>