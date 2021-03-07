import { Item, Brand, Category } from "./Responses";

export class ItemImpl implements Item {
    name: string;
    id: number;
    category: Category;
    brand?: Brand;
    path: string;

    constructor(item: Item) {
        this.id = item.id;
        this.name = item.name;
        this.category = item.category;
        
        if (item.brand != undefined) {
            this.brand = item.brand;
        }

        this.path = `items/${this.id}/analytics`;
    }
}

export class BrandImpl implements Brand {
    id: number;
    name: string;
    path: string;

    constructor(brand: Brand) {
        this.id = brand.id;
        this.name = brand.name;
        this.path = `items/brand/${this.id}/analytics`;
    }
}

export class CategoryImpl implements Category {
    id: number;
    name: string;
    path: string;

    constructor(category: Category) {
        this.id = category.id;
        this.name = category.name;
        this.path = `items/category/${this.id}/analytics`;
    }
}