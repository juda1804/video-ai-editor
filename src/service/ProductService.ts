import { isValidProduct, Product } from "../types";

export async function saveProduct(product: Product): Promise<Product> {
    if (!isValidProduct(product)) {
        return Promise.reject(new Error('Invalid product data'));
    }
    
    return fetch('http://localhost:3000/api/products/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    }).then(response => response.json());
}

export async function getAllProductsByUsername(username: string): Promise<Product[]> {
    return fetch(`http://localhost:3000/api/products/username/${username}`)
        .then(response => response.json());
}

export async function getProductById(productId: string): Promise<Product> {
    return fetch(`http://localhost:3000/api/products/${productId}`)
        .then(response => response.json());
}
