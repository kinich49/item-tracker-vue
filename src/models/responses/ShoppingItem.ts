import Brand from "./Brand";
import Category from "./Category";
import Model from "./Model";

export default interface ShoppingItem extends Model {
    quantity: string,
    unitPrice: string,
    totalPrice: string,
    category: Category,
    brand?: Brand
}