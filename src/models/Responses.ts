export interface Model {
    id: number,
    name: string
}

export interface Item extends Model {
    category: Category,
    brand?: Brand
}

export interface Brand extends Model {

}

export interface Category extends Model {

}

export interface Store extends Model {

}

export interface AnalyticsModel {
    latestPrice: string,
    latestStore: string,
    latestDate: string,
    averagePrice: string,
    item: Item
}

export interface SuggestionModel {
    categories?: Array<Category>,
    brands?: Array<Brand>,
    items?: Array<Item>
}
