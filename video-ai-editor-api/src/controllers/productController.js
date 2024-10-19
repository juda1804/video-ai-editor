const { v4: uuidv4 } = require('uuid');
const { storeProduct, getProductByDocumentId, getAllProductsByUsername }  = require('../services/producService');

const logger = require('../logger');

const Product = require('../models/types');

const createProduct = async (req, res) => {
    try {
        const { name, price, description, copys, landings, videoUrls, tikTokLinks, angles } = req.body;
        logger.info(`Creating product: ${JSON.stringify(req.body)}`);

        const newProduct = new Product(
            uuidv4(),
            name,
            price,
            description,
            copys,
            landings,
            videoUrls,
            tikTokLinks,
            angles
        );

        const product = await storeProduct({...newProduct, user: 'test'});
        res.status(200).json(product);
    } catch (error) {
        logger.error(`Error creating product: ${error.message}`, error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await getProductByDocumentId(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        logger.error(`Error retrieving product: ${error.message}`, error);
        res.status(500).json({ message: 'Error retrieving product', error: error.message });
    }
};

const getProductsByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const products = await getAllProductsByUsername(username);
        res.status(200).json(products);
    } catch (error) {
        logger.error(`Error retrieving products: ${error.message}`, error);
        res.status(500).json({ message: 'Error retrieving products', error: error.message });
    }
};


module.exports = {
    createProduct,
    getProductById,
    getProductsByUsername
};
