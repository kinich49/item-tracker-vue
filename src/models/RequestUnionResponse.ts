import { Item as ItemRequest, Brand as BrandRequest, Category as CategoryRequest, Store as StoreRequest } from "./Requests";
import { Item as ItemResponse, Brand as BrandResponse, Category as CategoryResponse, Store as StoreResponse } from "./Responses";
import { ComboBoxSuggestion } from "./ComboBoxSuggestion";

export type Item = ItemRequest | ItemResponse;
export type Brand = BrandRequest | BrandResponse;
export type Category = CategoryRequest | CategoryResponse;
export type Store = StoreRequest | StoreResponse;

export interface ItemSuggestion extends ComboBoxSuggestion<Item> {

}

export interface BrandSuggestion extends ComboBoxSuggestion<Brand> {

};

export interface CategorySuggestion extends ComboBoxSuggestion<Category> {

}

export interface StoreSuggestion extends ComboBoxSuggestion<Store> {

}
