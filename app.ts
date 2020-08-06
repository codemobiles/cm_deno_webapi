import { Application, Router, Status } from "https://deno.land/x/oak/mod.ts";
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

let count = products.length;

function notFound(response: any, message: string) {
    response.status = Status.NotFound;
    response.body = { message };
}

function badRequest(response: any) {
    response.status = Status.BadRequest;
    response.body = { message: "Invalid request" };
}

router
    .get("/product", ({ response }: { response: any; }) => {
        response.body = products;
    })
    .get("/product/price", ({ response, request }: { response: any; request: any }) => {
        const min = request.url.searchParams.get("min");
        const max = request.url.searchParams.get("max");

        if (!min || !max) {
            badRequest(response);
            return;
        }

        const productList = products.filter((product) => product.price >= Number(min) && product.price <= Number(max));
        response.body = productList;
    })
    .get("/product/:id", ({ response, params }: { response: any; params: { id: string } }) => {
        if (params && params.id) {
            const product: Product | undefined = products.find((product) => product.id?.toString() == params.id);
            if (!product) {
                notFound(response, `product id: ${params.id} not found`);
                return;
            }
            response.body = product;
        }
    })
    .post("/product", async ({ response, request }: { response: any; request: any }) => {
        if (!request.hasBody) {
            badRequest(response);
            return;
        }
        const product: { name: string, price: number, stock: number } = await request.body().value;
        count += 1;
        products.push({
            id: count,
            ...product
        })
        response.body = { message: "Add Product Successfully" };
    })
    .put("/product/:id", async ({ response, request, params }: { response: any; request: any; params: { id: string } }) => {
        if (!request.hasBody) {
            badRequest(response);
            return;
        }

        if (params && params.id) {
            const index = products.findIndex((product) => product.id?.toString() == params.id);
            if (index !== -1) {
                const product: { name: string, price: number, stock: number } = await request.body().value;
                products[index].name = product.name;
                products[index].price = product.price;
                products[index].stock = product.stock;
                response.body = { message : 'Update Product Successfully'};
                return;
            }
            notFound(response, `product id: ${params.id} not found`);
        }
    })


app.use(router.routes());

app.addEventListener("listen", ({ secure, hostname, port }) => {
    const protocol = secure ? "https://" : "http://";
    const url = `${protocol}${hostname}:${port}`;
    console.log(bold("Listening on: " + green(url)));
})

await app.listen(`${HOST}:${PORT}`);