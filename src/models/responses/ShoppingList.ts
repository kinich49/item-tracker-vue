import Model from "./Model";
import ShoppingItem from "./ShoppingItem";
import Store from "./Store";

export default interface ShoppingList {
    id: number,
    localDate: Date,
    store: Store,
    shoppingItems: Array<ShoppingItem>
}