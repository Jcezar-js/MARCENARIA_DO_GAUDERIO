const express = require ('express');
const router = express.Router();
const Product = require('../models/product_schema');

// Rota para obter todos os produtos 

router.get ('/', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
      
})
//ROTA PARA OBTER PRODUTO PELO ID
router.get('/:id', async (req, res) => {
  try {
    const products = await Product.findById(req.body.id);
    res.json(products);
  }catch (err) {
    res.status(500).json({ message: err.message });
}
}) 

// Rota para criar um novo produto
router.post('/', async (req, res) => {
  // Cria um novo objeto Product com os dados do 'body' da requisição
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price
  });

  try {
    //Tenta salvar o novo produto no banco de dados
    const newProduct =  await product.save();
    res.status(201).json(newProduct); // Retorna o produto criado com status 201 (Created)
  } catch (err){
    res.status(400).json({ message: err.message }); // Retorna erro 400 (Bad Request) em caso de falha
  }
});



module.exports = router;