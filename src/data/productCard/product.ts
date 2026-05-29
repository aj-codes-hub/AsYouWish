import type { ProductType } from "./productType";

export const Product: ProductType[] = [
    {
       id: 1,
       title: "Product name in detail",
       details: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat nisi quam quasi nesciunt incidunt voluptates illo voluptatibus. Ab earum amet, velit incidunt repellat, iure sapiente temporibus unde nulla excepturi sit.",
       price: 999,
       Rating: 5,
       discount: 50,
       likes: 1200,
       mainImage: "./images/blue-dress.jpg",
       moreImages:[
        "./images/blue-dress.jpg",
        "./images/blue-dress.jpg",
        "./images/blue-dress.jpg",
       ],
       review: [
           {
            id: 1,
            customerName: "Sara",
            message: "customer says Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas inventore, id officia dolorem reprehenderit incidunt nobis, eum quasi, quos explicabo culpa. Facere quidem alias placeat atque dignissimos aliquam nisi et.",
            Rating: 5,
            mainImage: "./images/blue-dress.jpg",
            moreImages:[
                "./images/blue-dress.jpg",
                "./images/blue-dress.jpg",
                "./images/blue-dress.jpg",
            ],
           },
            {
            id: 2,
            customerName: "johan",
            message: "customer says Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas inventore, id officia dolorem reprehenderit incidunt nobis, eum quasi, quos explicabo culpa. Facere quidem alias placeat atque dignissimos aliquam nisi et.",
            Rating: 5,
            mainImage: "./images/blue-dress.jpg",
            moreImages:[
                "./images/blue-dress.jpg",
                "./images/blue-dress.jpg",
                "./images/blue-dress.jpg",
            ],
           },
       ]
    }
]