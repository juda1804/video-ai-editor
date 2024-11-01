const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const chatGptController = require('../controllers/chatGptController');

// Route to create a new product
router.post('/', ProductController.createProduct);

// Route to get a product by ID
router.get('/:id', ProductController.getProductById);

// Route to update a product by ID
router.put('/:id', ProductController.updateProduct);

// Route to get all products by username
router.get('/username/:username', ProductController.getProductsByUsername);

router.post('/vomito-de-mercado', ProductController.uploadVomitoDeMercado);

router.get('/:id/analize-options', chatGptController.analizeOptions);

module.exports = router;
