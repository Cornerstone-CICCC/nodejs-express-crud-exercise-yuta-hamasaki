import express, { NextFunction, Request, Response } from 'express';
import { Product, ProductRequestBody } from './type/product';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Process incoming JSON
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Received request ${req.url} at ${new Date()}`)
  next()
})

let products: Product[] = []

app.get("/products",( req: Request, res:Response)=>{
  res.json(products)
})

app.get('/products/:id',(req: Request<{id: string}>, res: Response)=>{
  const {id} = req.params;
  const product = products.find(product => product.id === id)

  if(product){
    res.json(product)
  }else{
    res.status(404).send("Could not find product")
  }
})

app.post("/products", (req: Request<{},{}, ProductRequestBody>, res: Response)=>{
  console.log(req.body)

  const product: Product = {
    id: uuidv4(),
    product_name:req.body.product_name,
    product_description:req.body.product_description,
    product_price:req.body.product_price,
  }

  products.push(product)

  res.status(201).json(product)
}
)

app.put('/products/:id', (req: Request<{id: string},{}, ProductRequestBody>, res: Response)=>{
  const { id } = req.params;
  const foundIndex = products.findIndex(product => product.id === id);
  if (foundIndex !== -1) {
    const updatedProduct: Product = {
      ...products[foundIndex],
      product_name:req.body.product_name,
      product_description:req.body.product_description,
      product_price:req.body.product_price,
    };
    products[foundIndex] = updatedProduct;
    res.json(updatedProduct);
  } else {
    res.status(404).send('product does not exist');
  }
})

app.delete('/products/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const foundIndex = products.findIndex(product => product.id === id);
  if (foundIndex !== -1) {
    products = products.splice(foundIndex, 1);
    res.status(200).send('Product deleted');
  } else {
    res.status(404).send('Product does not exist');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
