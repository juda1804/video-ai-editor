const { v4: uuidv4 } = require('uuid');
const { uploadVomitoDeMercadoToGCS } = require('../services/productService');
const { storeProduct, getProductByDocumentId, getAllProductsByUsername, updateProductById }  = require('../repository/producRepository');
const fs = require('fs');
const os = require('os');
const path = require('path');

const logger = require('../logger')('productController');

const Product = require('../models/types');

const createProduct = async (req, res) => {
    try {
        const { _id, 
            id, 
            name, 
            price, 
            description, 
            landings, 
            videoUrls, 
            tikTokLinks, 
            angles, 
            username, 
            vomitoDeMercadoUrl, 
            step } = req.body;
            
        logger.info(`Creating product: ${JSON.stringify(req.body)}`);

        const newProduct = new Product(
            id || uuidv4(),
            name,
            price,
            description,
            landings,
            videoUrls,
            tikTokLinks,
            angles,
            username,
            vomitoDeMercadoUrl,
            step
        );

        const product = await storeProduct({...newProduct, _id: _id || undefined});
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

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        logger.info(`Updating product with ID: ${id}, Data: ${JSON.stringify(updateData)}`);

        const updatedProduct = await updateProductById(id, updateData);

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        logger.error(`Error updating product: ${error.message}`, error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

const uploadVomitoDeMercado = async (req, res) => {
    try {
        const description  = req.body;        
        const uuid = uuidv4();
        const file = getFileFromString(description, `${uuid}.txt`);
        const bucketUri = await uploadVomitoDeMercadoToGCS(file);
        res.status(200).json({ bucketUri });
    } catch (error) {
        logger.error(`Error uploading vomito de mercado: ${error.message}`, error);
        res.status(500).json({ message: 'Error uploading vomito de mercado', error: error.message });
    }
}

const getFileFromString = (content, filename) => {
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, filename);
    
    try {
        fs.writeFileSync(tempFilePath, content, 'utf-8');
        
        // Check if the file exists after writing
        if (fs.existsSync(tempFilePath)) {
            logger.info(`File created successfully: ${tempFilePath}`);
            return tempFilePath;
        } else {
            logger.error(`Failed to create file: ${tempFilePath}`);
            throw new Error('File creation failed');
        }
    } catch (error) {
        logger.error(`Error creating file: ${error.message}`, error);
        throw error;
    }
};

module.exports = {
    createProduct,
    getProductById,
    getProductsByUsername,
    updateProduct,
    uploadVomitoDeMercado
};
