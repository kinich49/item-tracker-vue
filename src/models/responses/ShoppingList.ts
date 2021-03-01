import Model from "./Model";
import ShoppingItem from "./ShoppingItem";
import Store from "./Store";

export default interface ShoppingList {
    id?: number,
    shoppingDate: Date,
    store: Store,
    shoppingItems: Array<ShoppingItem>
}