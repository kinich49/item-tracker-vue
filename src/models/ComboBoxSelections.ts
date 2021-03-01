import {Item, Brand, Category, Store} from "./Requests"

interface ComboBoxSelection<Type> {
    text: string;
    value: Type;
}

export type ItemSelection = ComboBoxSelection<Item>;
export type BrandSelection = ComboBoxSelection<Brand>;
export type CategorySelection = ComboBoxSelection<Category>;
export type StoreSelection = ComboBoxSelection<Store>