<template>
  <v-app>
    <v-app-bar app color="primary" dark >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
      </div>
      <v-toolbar-title>Item Tracker</v-toolbar-title>
            <v-progress-linear
            :active="loading"
            indeterminate
            color="yellow darken-2"
            absolute
            bottom
      ></v-progress-linear>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" temporary bottom>
      <v-list dense nav>
        <v-list-item to="/" link>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>Home</v-list-item-content>
        </v-list-item>
        <v-list-item to="/blankShoppingList">
          <v-list-item-icon>
            <v-icon>mdi-receipt</v-icon>
          </v-list-item-icon>
          <v-list-item-content>Blank Shopping List</v-list-item-content>
        </v-list-item>
        <v-list-item to="/analytics" link>
          <v-list-item-icon>
            <v-icon>mdi-google-analytics</v-icon>
          </v-list-item-icon>
          <v-list-item-content>Analytics</v-list-item-content>
        </v-list-item>
      </v-list>
      
      <template v-slot:append>
        <v-list dense nav>
          <v-list-item href="https://github.com/" target="_blank">
            <v-list-item-icon>
              <v-icon>mdi-github</v-icon>
            </v-list-item-icon>
            <v-list-item-content>Github</v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  components: {},

  data: () => ({
    drawer: false,
    loading: false
  }),

  metaInfo: {
    meta: [{ name: "viewport", content: "width-device-width, initial-scale=1" }]
  },

  mounted() {
    this.$root.$on('on-loading-change', (data: boolean) => {
        this.loading = data;
    });
}
});

</script>
