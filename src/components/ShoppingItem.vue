<template>
  <div>
    <form>
      <label>Item name</label>
      <input type="text" />
      <br />
      <label>Quantity</label>
      <input v-model="quantity" />
      <br />
      <label>Unit Price</label>
      <input v-model="unitPrice" type="text" />
      <br />
      <label>Total Price</label>
      <input :value="quantity * unitPrice" readonly disabled />
    </form>
    <br/>
  </div>
</template>

<script>
export default {
  name: "ShoppingItem",
  data() {
    return {
      quantity: null,
      unitPrice: null
    };
  },
  props: ["id"]
};
</script>