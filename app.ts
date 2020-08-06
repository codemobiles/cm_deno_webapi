import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { bold, green } from "https://deno.land/std@0.63.0/fmt/colors.ts";

const env = Deno.env.toObject();
const PORT = env.PORT || 1150;
const HOST = env.HOST || '127.0.0.1';

const app = new Application();
const router = new Router();

router.get("/", (context) => {
    context.response.body = [{
        name : "tanakorn",
        age : 30
    }]
}).get("/product/:id", (context) => {
    if(context.params && context.params.id){
        context.response.body = "product: " + context.params.id;
    }
})

app.use(router.routes());

app.addEventListener("listen", ({ secure, hostname, port }) => {
    const protocol = secure ? "https://" : "http://";
    const url = `${protocol}${hostname}:${port}`;
    console.log(bold("Listening on: " + green(url)));
})

await app.listen(`${HOST}:${PORT}`);