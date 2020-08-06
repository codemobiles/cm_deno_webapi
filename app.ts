import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { bold, green } from "https://deno.land/std@0.63.0/fmt/colors.ts";
import Product from "./models/product.ts";

const env = Deno.env.toObject();
const PORT = env.PORT || 1150;
const HOST = env.HOST || '127.0.0.1';

const app = new Application();
const router = new Router();

let products: Array<Product> = [
    {
        id: 1,
        name: "macbook pro",
        price: 120000,
        stock: 5,
    },
    {
        id: 2,
        name: "iPhone XR",
        price: 40000,
        stock: 1,
    }
]

let number = products.length;

router
    .get("/product", (context) => {
        context.response.body = products;
    })
    .get("/product/price", (context) => {
        const min = context.request.url.searchParams.get("min");
        const max = context.request.url.searchParams.get("max");

        if (!min || !max) {
            context.response.body = { message: "Invalid request" };
            context.response.status = 400;
            return;
        }

        const productList = products.filter((product) => product.price >= Number(min) && product.price <= Number(max));
        context.response.body = productList;
    })
    .get("/product/:id", (context) => {
        if (context.params && context.params.id) {
            const product: Product | undefined = products.find((product) => product.id == context.params.id);
            if (!product) {
                context.response.body = { message: `product id: ${context.params.id} not found` };
                context.response.status = 404
                return;
            }
            context.response.body = product;
        }
    })


app.use(router.routes());

app.addEventListener("listen", ({ secure, hostname, port }) => {
    const protocol = secure ? "https://" : "http://";
    const url = `${protocol}${hostname}:${port}`;
    console.log(bold("Listening on: " + green(url)));
})

await app.listen(`${HOST}:${PORT}`);