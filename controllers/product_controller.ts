import {Request, Response} from 'express';
import Product from '../models/product_schema';
import {z} from 'zod';

const productSchema = z.object({
  name: z.string({ error : "O nome é obrigatório"}).min(3, 'O nome deve conter pelo menos 3 caracteres'),
  description: z.string().min(1, 'A descrição é obrigatória'),
  price: z.number().nonnegative('O preço deve ser um número não negativo'),
  photos: z.array(z.string().url()).optional(),
  isFeatured: z.boolean().optional()
})

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  }catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
//Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product == null){
      return res.status(404).json({message: 'Produto não encontrado'});
    }
    res.json(product);
  }catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
//Create a new product
export const createProduct = async (req: Request, res: Response) => {
  const {name, description, price, photos, isFeatured} = req.body;
  if (!name || !description || !price == null) {
    return res.status(400).json({message: 'Nome, descrição e preço são obrigatórios.'});
  }
  const product = new Product({
    name: name,
    description:description,
    price: price,
    photos: photos || [],
    isFeatured: isFeatured || false, 
  });
  try {
    const newProduct =  await product.save();
    res.status(201).json(newProduct);
  } catch (err:any){
    res.status(400).json({ message: err.message });
  }
}

//Update an existing product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product == null){
      return res.status(404).json({message: 'Produto não encontrado'});
    }
    const {name, description, price, photos, isFeatured} = req.body;
    if (name != null) {
      product.name = name;
    }
    if (description != null) {
      product.description = description;
    }
    if (price != null) {
      product.price = price;
    }
    if (photos != null) {
      product.photos = photos;
    }
    if (isFeatured != null) {
      product.isFeatured = isFeatured;
    }
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err:any) {
    res.status(400).json({ message: err.message });
  }

}


  //Delete a product

export const deleteProduct = async (req: Request, res: Response) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (product == null){
        return res.status(404).json({message: 'Produto não encontrado'});
      }  else {
        await Product.findByIdAndDelete(req.params.id);
        res.json({message: 'Produto deletado com sucesso'});
      }
    }catch (err:any) {
      res.status(500).json({ message: err.message });
    }
  }