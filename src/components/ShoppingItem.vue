<template>
  <div>
    <form>
      <label>Item name</label>
      <input v-model="name" type="text" @keyup="$emit('update:name', name)" />
      <br />
      <label>Quantity</label>
      <input v-model="quantity" @keyup="$emit('update:quantity', quantity)" />
      <br />
      <label>Unit Price</label>
      <input v-model="unitPrice" type="text" @keyup="$emit('update:unitPrice', unitPrice)" />
      <br />
      <label>Total Price</label>
      <input readonly disabled :value="totalPrice" />
    </form>
    <br />
  </div>
</template>

<script>
export default {
  name: "ShoppingItem",
  props: ["id"],
  data: () => {
    return {
      name: null,
      quantity: null,
      unitPrice: null
    }
  },
  computed: {
    totalPrice() {
      return this.quantity * this.unitPrice;
    }
  }
};
</script>