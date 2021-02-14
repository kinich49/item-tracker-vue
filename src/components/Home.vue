<template>
  <div>
    <div id="content">
      <h1>Welcome to Item Tracker</h1>
      <div id="main">
        <p>
          This is a simple app to keep track of your week-to-week shopping. If you're curious about price increments throughout
          the year of things you buy periodically, or price differences between stores you frequently alternate,
          simply go to Shopping List and start saving those receipts!
        </p>

        <p>
          It also features an analytics section that will let you search for a particular item, brand or category,
          and display useful info about the item(s).
          Currently, the info is limited to:
        </p>
        <ul>
          <li>Last store where you bought the item</li>
          <li>Last date when you bought the item</li>
          <li>Last registered unit price</li>
          <li>Average unit price</li>
        </ul>
        <p>More data will be considered in future updates</p>
        <p>
          Each receipt must have a store, a date and at least one item. Each item must have a name, quantity, unit price,
          a unit and must be linked to a Category. The Brand is optional
          Quantity means how much of that item you bought.
          Unit is either the weight or a single container. For example, a carton of milk's quantity would be 1 and the unit would be 'unit'.
          On the other hand, you usually buy ground beef per kilo, For example, 0.500 KG of ground beef.
        </p>

        <p>
          There are different categories already persisted, for Example
          <em>'Dairy and eggs'</em> or
          <em>'Household Cleaning and Disposables'</em>
          among others. If your current item does not fit into any current category, just type
          the name and it will be persisted for future items
        </p>

        <p>For now, the item's Brand is optional due to several items not having a specific brand such as fruits and vegetables.</p>

        <p>
          When you're adding a brand new item to a shopping receipt (It's the first time you're saving this item)
          you will have to manually enter the Category and Brand.
          On the contrary, if it's not a brand new item, the Brand and Category fields will be auto populated.
          For now, Quantity, Unit and Unit Price will have to be manually added in every receipt
        </p>

        <p>
          All items are saved internally in MXN currency for now.
          Support for other currencies will be considered for a future update
        </p>

        <p>
          If you find a bug, or are interested in requesting a feature, please go to the
          <a
            href="https://www.github.com"
            target="_blank"
          >project's github</a>
          and file an issue. Any pull request is appreciated!
        </p>
      </div>
    </div>

    <v-footer absolute class="font-weight-light">
      <v-col class="text-end" cols="12">
        {{ new Date().getFullYear() }} —
        <strong>Made by S.J.Lara</strong>
      </v-col>
    </v-footer>
  </div>
</template>

<script>
export default {};
</script>


<style scoped>
#content {
  display: grid;
  padding-top: 12px;
  gap: 24px;
  grid-template-columns: 1fr minmax(320px, 2fr) 1fr;
  grid-template-rows: 75px 1fr;
  grid-template-areas:
    ". title ."
    ". content .";
}

h1 {
  grid-area: title;
  justify-self: center;
}

#main {
  grid-area: content;
}
/* 
  ##Device = Desktops
  ##Screen = 1281px to higher resolution desktops
*/
/* @media (min-width: 1281px) {

} */

/* 
  ##Device = Most of the Smartphones Mobiles (Portrait)
  ##Screen = B/w 320px to 479px
*/
/* @media (min-width: 320px) and (max-width: 480px) {

} */
</style>