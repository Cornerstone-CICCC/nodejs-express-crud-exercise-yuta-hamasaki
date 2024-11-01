"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json()); // Process incoming JSON
app.use((req, res, next) => {
    console.log(`Received request ${req.url} at ${new Date()}`);
    next();
});
let products = [];
app.get("/products", (req, res) => {
    res.json(products);
});
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    const product = products.find(product => product.id === id);
    if (product) {
        res.json(product);
    }
    else {
        res.status(404).send("Could not find product");
    }
});
app.post("/products", (req, res) => {
    console.log(req.body);
    const product = {
        id: (0, uuid_1.v4)(),
        product_name: req.body.product_name,
        product_description: req.body.product_description,
        product_price: req.body.product_price,
    };
    products.push(product);
    res.status(201).json(product);
});
app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const foundIndex = products.findIndex(product => product.id === id);
    if (foundIndex !== -1) {
        const updatedProduct = Object.assign(Object.assign({}, products[foundIndex]), { product_name: req.body.product_name, product_description: req.body.product_description, product_price: req.body.product_price });
        products[foundIndex] = updatedProduct;
        res.json(updatedProduct);
    }
    else {
        res.status(404).send('product does not exist');
    }
});
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    const foundIndex = products.findIndex(product => product.id === id);
    if (foundIndex !== -1) {
        products = products.splice(foundIndex, 1);
        res.status(200).send('Product deleted');
    }
    else {
        res.status(404).send('Product does not exist');
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
