const mongoose = require('mongoose');
const connectDB = require('../config/db');
const ProductSchema = require('../models/Product');
const { log } = require('console');

const logger = require('../logger')('productRepository');

async function storeProduct(productData) {
    try {
        await connectDB();
    
        const product = new ProductSchema(productData);

        const validationError = product.validateSync();

        if (validationError) {
            logger.error('Validation error:', validationError);
            return { error: 'Validation failed', details: validationError.errors };
        }
    
        if (!productData._id) {
            const savedProduct = await product.save();
            logger.info('New product saved successfully:', JSON.stringify(savedProduct));
            return savedProduct;
        } else {
            const savedProduct = await ProductSchema.findByIdAndUpdate(product._id, product, { new: true });
            if (savedProduct) {
                logger.info('Existing product updated successfully:', JSON.stringify(savedProduct));
            } else {
                logger.warn('No existing product found with _id:', product._id);
            }
            return savedProduct;
        }
    } catch (error) {
        logger.error('Error saving/updating product:', error);
        throw error;
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
            logger.info('Product not found');
            return undefined;
        }

        logger.info('Product retrieved successfully:', product);
        return product;
    } catch (error) {
        logger.error('Error retrieving product:', error);
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
            logger.info('Product not found');
            return [];
        }
        
        return products;
    } catch (error) {
        logger.error('Error retrieving product:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
    }
}

// ... existing code ...

async function updateProductById(productId, updateData) {
    logger.info(`Updating product by document ID: ${productId}`);
    try {
        await connectDB();

        const objectId = mongoose.Types.ObjectId(productId);

        const updatedProduct = await ProductSchema.findByIdAndUpdate(objectId, updateData, { new: true });

        if (!updatedProduct) {
            logger.info('Product not found');
            return undefined;
        }

        logger.info('Product updated successfully:', updatedProduct);
        return updatedProduct;
    } catch (error) {
        logger.error('Error updating product:', error);
        return undefined;
    } finally {
        await mongoose.connection.close();
    }
}

async function addVideoLinksToProduct(productId, videoLinks) {
    logger.info(`Adding video links to product ID: ${productId}`);
    try {
        await connectDB();

        const objectId = mongoose.Types.ObjectId(productId);

        const updatedProduct = await ProductSchema.findByIdAndUpdate(
            objectId,
            { $push: { videoLinks: { $each: videoLinks } } },
            { new: true }
        );

        if (!updatedProduct) {
            logger.info('Product not found');
            return undefined;
        }

        logger.info('Video links added successfully:', updatedProduct);
        return updatedProduct;
    } catch (error) {
        logger.error('Error adding video links to product:', error);
        return undefined;
    } finally {
        await mongoose.connection.close();
    }
}

module.exports = {
    storeProduct,
    getProductByDocumentId,
    getAllProductsByUsername,
    updateProductById,
    addVideoLinksToProduct
};
