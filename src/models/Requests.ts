export interface Model {
    id?: number,
    name: string
}

export interface Item extends Model {
    category: Category,
    brand?: Brand,
    currency: string;
    unit: string;
}

export interface Brand extends Model {

}

export interface Category extends Model {

}

export interface Store extends Model {

}

export interface ShoppingItem extends Model {
    quantity: number,
    unitPrice: number,
    unit: string,
    currency: string,
    category: Category,
    brand?: Brand
}

export interface ShoppingList {
    shoppingDate: Date,
    store: Store,
    shoppingItems: Array<ShoppingItem>
}
