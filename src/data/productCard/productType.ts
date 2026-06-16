
export type ReviewType = {
    id: number;
    customerName: string;
    message:string;
    Rating: number;
    mainImage: string;
    moreImages: string[];
}



export type ProductType = {
    id: number;
    Event?: string;
    title: string;
    details: string;
    price: number;
    Rating: number;
    discount: number;
    mainImage: string;
    moreImages: string[];
    review: ReviewType[];
}