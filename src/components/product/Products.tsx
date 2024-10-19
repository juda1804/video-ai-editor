// src/components/product/ProductSummary.tsx

import React from 'react';
import { Card, CardContent, Typography, List, ListItem } from '@mui/material';
import { Product } from '../../types';
import { getAllProductsByUsername } from '../../service/ProductService';

const ProductSummary: React.FC<{ username: string }> = ({ username }) => {
    const [products, setProducts] = React.useState<Product[]>([]);

    React.useEffect(() => {
        getAllProductsByUsername(username).then(setProducts);
    }, []);

    return (
        <>
            {
                products.map((product: Product) => (
                    <Card sx={{ maxWidth: 600, margin: '20px auto' }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                                {product.description}
                            </Typography>
                            <Typography variant="h6" component="div">
                                Angles:
                            </Typography>
                            <List>
                                {product.angles.map((angle: string, index: number) => (
                                    <ListItem key={index}>
                                        <Typography variant="body2">{angle}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                ))}
        </>
    );
};

export default ProductSummary;

