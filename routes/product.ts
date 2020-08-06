import { Router } from "https://deno.land/x/oak/mod.ts";
import productController from "../controllers/product.ts";

const router = new Router({
    prefix: "/product",
});

router
    .get("/", productController.getProducts)
    .get("/price", productController.getProductByPriceRange)
    .get("/:id", productController.getProduct)
    .post("/", productController.addProduct)
    .put("/:id", productController.updateProduct)
    .delete("/:id", productController.deleteProduct)

export default router
