// src/components/product/ProductSummary.tsx

import React from 'react';
import { Card, CardContent, Typography, List, ListItem, Button, Box } from '@mui/material';
import { Product } from '../../types';
import { getAllProductsByUsername } from '../../service/ProductService';
import { useNavigate } from 'react-router-dom';

const ProductSummary: React.FC<{ username: string }> = ({ username }) => {
    const navigate = useNavigate();
    const [products, setProducts] = React.useState<Product[]>([]);

    const handleButtonClick = (selectedProduct: Product) => {
        navigate(`/products/${selectedProduct._id}`);
    };

    React.useEffect(() => {
        getAllProductsByUsername(username).then(setProducts);
    }, []);

    return (
        <>
            {
                products.map((product: Product) => (
                    <Card 
                        sx={{ 
                            maxWidth: 300, 
                            margin: '10px', 
                            display: 'inline-block', 
                            position: 'relative', 
                            overflow: 'hidden' 
                        }} 
                        key={product.id}
                    >
                        <CardContent>
                            <Typography variant="h5">
                                {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                                {product.description}
                            </Typography>
                            <Typography variant="h6">
                                Stored Angles: {JSON.stringify(product.angles.length)}
                            </Typography>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                sx={{ display: 'block', margin: '10px auto' }}
                                onClick={() => handleButtonClick(product)}
                            >
                                Continue Product
                            </Button>
                            <Box 
                                sx={{ 
                                    position: 'absolute', 
                                    bottom: 0, 
                                    left: 0, 
                                    right: 0, 
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                                    color: 'white', 
                                    padding: '5px', 
                                    textAlign: 'center' 
                                }}
                            >
                                Preview angles: {JSON.stringify(product?.copys?.length || 0)}
                            </Box>
                        </CardContent>
                    </Card>
                ))
            }
        </>
    );
};

export default ProductSummary;
