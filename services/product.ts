import Product from "../models/product.ts";

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

const getProductAll = () => products;

const getProductById = (id: string): Product | undefined =>
    products.find((product) => product.id?.toString() == id);

const getProductByPriceRange = (min: string, max: string) =>
    products.filter((product) => product.price >= Number(min) && product.price <= Number(max));

const addProduct = (product: Product) => {
    count += 1;
    products.push({
        id: count,
        ...product,
    })
};

const updateProduct = (id: string, product: Product): boolean => {
    const index = products.findIndex((product) => product.id?.toString() == id);
    if (index !== -1) {
        products[index].name = product.name;
        products[index].price = product.price;
        products[index].stock = product.stock;
        return true;
    }
    return false;
};

const deleteProduct = (id: string): boolean => {
    const index = products.findIndex((product) => product.id?.toString() == id);
    if (index !== -1) {
        products.splice(index, 1);
        return true;
    }
    return false;
};

export default {
    getProductAll,
    getProductById,
    getProductByPriceRange,
    addProduct,
    updateProduct,
    deleteProduct,
}