import Item  from "./Item";

export default interface ItemAnalyticsDTO {
    item: Item,
    latestStore: String,
    latestDate: String,
    latestPrice: String,
    averagePrice: String
}