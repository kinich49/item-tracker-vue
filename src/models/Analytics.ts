export class Analytics {
    latestPrice: string;
    latestStoreAndDate: string;
    averagePrice: string;
    item: Item
}
  
export class Item {
    name: string;
    category: Category;
    brand?: Brand;
}

interface Model {
    id: number,
    name: string
}


interface Brand extends Model {

}

interface Category extends Model {

}