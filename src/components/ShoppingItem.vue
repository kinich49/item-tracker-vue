<template>
  <div>
    <form>
      <label>Item name</label>
      <input type="text" v-model="itemName" @keyup="$emit('update:itemName', itemName)"/>
      <br />
      <label>Quantity</label>
      <input v-model="quantity" @keyup="$emit('update:quantity', quantity)"/>
      <br />
      <label>Unit Price</label>
      <input v-model="unitPrice" type="text" @keyup="$emit('update:unitPrice', unitPrice)"/>
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
      unitPrice: null,
      itemName: null,
    };
  },
  props: ["id"]
};
</script>