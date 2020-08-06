import Product from "../models/product.ts";
import { Status } from "https://deno.land/x/oak/mod.ts";

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

const getProducts = ({ response }: { response: any; }) => {
    response.body = products;
};

const getProduct = ({ response, params }: { response: any; params: { id: string } }) => {
    if (params && params.id) {
        const product: Product | undefined = products.find((product) => product.id?.toString() == params.id);
        if (!product) {
            notFound(response, `product id: ${params.id} not found`);
            return;
        }
        response.body = product;
    }
};

const getProductByPriceRange = ({ response, request }: { response: any; request: any }) => {
    const min = request.url.searchParams.get("min");
    const max = request.url.searchParams.get("max");

    if (!min || !max) {
        badRequest(response);
        return;
    }

    const productList = products.filter((product) => product.price >= Number(min) && product.price <= Number(max));
    response.body = productList;
}

const addProduct = async ({ response, request }: { response: any; request: any }) => {
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
};

const updateProduct = async ({ response, request, params }: { response: any; request: any; params: { id: string } }) => {
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
            response.body = { message: 'Update Product Successfully' };
            return;
        }
        notFound(response, `product id: ${params.id} not found`);
    }
};

const deleteProduct = ({ response, params }: { response: any; params: { id: string } }) => {
    if (params && params.id) {
        const index = products.findIndex((product) => product.id?.toString() == params.id);
        if (index !== -1) {
            products.splice(index, 1);
            response.status = Status.NoContent;
            response.body = { message: 'Delete Product Successfully' };
            return;
        }
        notFound(response, `product id: ${params.id} not found`);
    }
};

export default {
    getProducts,
    getProduct,
    getProductByPriceRange,
    addProduct,
    updateProduct,
    deleteProduct,
}