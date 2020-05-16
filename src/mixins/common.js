let mixin = {
    methods: {
        validateShoppingItem(item) {
            return (
                item &&
                this.isItemElementNameValid(item) &&
                this.isItemElementNameValid(item.brand) &&
                this.isItemElementNameValid(item.category) &&
                this.isItemNumberValid(item.quantity) &&
                this.isItemNumberValid(item.unitPrice)
            )
        },
        isItemElementNameValid(value) {
            return value && value.name && value.name.length > 0;
        },
        isItemStringValid(value) {
            return value && value.length > 0
        },
        isItemNumberValid(value) {
            return value && value > 0
        }
    }
}

export { mixin };