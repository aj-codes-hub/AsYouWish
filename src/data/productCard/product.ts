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
       mainImage: "mainImage",
       moreImages:[
        "image 1",
        "image 2",
        "image 3",
       ],
       review: [
           {
            id: 1,
            customerName: "Sara",
            message: "customer says Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas inventore, id officia dolorem reprehenderit incidunt nobis, eum quasi, quos explicabo culpa. Facere quidem alias placeat atque dignissimos aliquam nisi et.",
            Rating: 5,
            mainImage: "main image",
            moreImages: [
                "image 1",
                "image 2",
                "image 3",
            ],
           },
       ]
    }
]