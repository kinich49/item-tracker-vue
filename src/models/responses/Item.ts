import Brand from "./Brand";
import Category from "./Category";
import Model from "./Model";

export default interface Item extends Model {
    category: Category,
    brand: Brand,
    currency: string;
    unit: string;
}