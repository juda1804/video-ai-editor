import { isValidProduct, isValidProductInformation, Product } from "../types";

export async function saveProduct(product: Product): Promise<Product> {
    if (!isValidProductInformation(product)) {
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

export async function saveDraftProduct(product: Product): Promise<Product> {
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

export type VomitoDeMercadoResponse = {
    bucketUri: string;
}

export async function uploadVomitoDeMercado(description: string): Promise<VomitoDeMercadoResponse> {
    return fetch('http://localhost:3000/api/products/vomito-de-mercado', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: description,
    }).then((response: Response) => response.json());
}
