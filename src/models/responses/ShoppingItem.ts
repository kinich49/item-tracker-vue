import Brand from "./Brand";
import Category from "./Category";
import Model from "./Model";

export default interface ShoppingItem extends Model {
    quantity: number,
    unitPrice: number,
    unit: string,
    currency: string,
    category: Category,
    brand?: Brand
}