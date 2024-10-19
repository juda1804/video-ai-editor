const mongoose = require('mongoose');
const connectDB = require('../config/db');
const ProductSchema = require('../models/Product');
const logger = require('../logger');

async function storeProduct(productData) {
    try {
        await connectDB();
    
        const product = new ProductSchema(productData);

        const validationError = product.validateSync();
        if (validationError) {
            console.error('Validation error:', validationError);
            return { error: 'Validation failed', details: validationError.errors };
        }
    
        const savedProduct = await product.save();

        console.log('Product saved successfully:', savedProduct);
        return savedProduct;
    } catch (error) {
        console.error('Error saving product:', error);
    } finally {
        await mongoose.connection.close();
    }
}

async function getProductByDocumentId(productId) {
    logger.info(`Getting product by document ID: ${productId}`);
    try {
        await connectDB();

        const objectId = mongoose.Types.ObjectId(productId);

        const product = await ProductSchema.findById(objectId);

        if (!product) {
            console.log('Product not found');
            return undefined;
        }

        console.log('Product retrieved successfully:', product);
        return product;
    } catch (error) {
        console.error('Error retrieving product:', error);
        return undefined;
    } finally {        
        await mongoose.connection.close();
    }
}

async function getAllProductsByUsername(username) {
    logger.info(`Getting products by username: ${username}`);
    try {
        await connectDB();


        const products = await ProductSchema.find({ user: username });

        if (!products) {
            console.log('Product not found');
            return [];
        }
        
        return products;
    } catch (error) {
        console.error('Error retrieving product:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
    }
}



module.exports = {
    storeProduct,
    getProductByDocumentId,
    getAllProductsByUsername
};
