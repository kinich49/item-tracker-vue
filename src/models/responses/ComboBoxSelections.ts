import Brand from "./Brand";
import Category from "./Category";
import Item from "./Item";
import Store from "./Store";

interface ComboBoxSelection<Type> {
    text: string;
    value: Type;
}

export type ItemSelection = ComboBoxSelection<Item>;
export type BrandSelection = ComboBoxSelection<Brand>;
export type CategorySelection = ComboBoxSelection<Category>;
export type StoreSelection = ComboBoxSelection<Store>