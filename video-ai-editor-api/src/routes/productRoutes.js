const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

// Route to create a new product
router.post('/', ProductController.createProduct);

// Route to get a product by ID
router.get('/:id', ProductController.getProductById);

// Route to get all products by username
router.get('/username/:username', ProductController.getProductsByUsername);

module.exports = router;

