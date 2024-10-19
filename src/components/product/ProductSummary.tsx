// src/components/product/ProductSummary.tsx

import React from 'react';
import { Card, CardContent, Typography, List, ListItem, Button, Box, IconButton } from '@mui/material';
import { Product } from '../../types';
import { getAllProductsByUsername } from '../../service/ProductService';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductSummary: React.FC<{ username: string }> = ({ username }) => {
    const navigate = useNavigate();
    const [products, setProducts] = React.useState<Product[]>([]);

    const handleButtonClick = (selectedProduct: Product) => {
        navigate(`/products/${selectedProduct._id}`);
    };

    const handleDelete = (productId: string | undefined) => {
        console.log(`Delete product with id: ${productId}`);
    };

    React.useEffect(() => {
        getAllProductsByUsername(username).then(setProducts);
    }, []);

    return (
        <>
            <Typography variant="h4" color="black" sx={{ textAlign: 'center', marginBottom: '20px' }}>
                Resumen de productos
            </Typography>
            {products.length === 0 ? (
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        height: '100vh', 
                        textAlign: 'center', 
                        margin: '20px' 
                    }}
                >
                    <Typography variant="h6" color="black">
                        No products created
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ 
                            marginTop: '20px',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            transform: 'translateY(-2px)',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.2)',
                            }
                        }}
                        onClick={(event) => {
                            event.preventDefault();
                            navigate('/');
                        }}
                    >
                        Create Product
                    </Button>
                </Box>
            ) : (
                products.map((product: Product) => (
                    <Card
                        sx={{
                            width: 300, // Set a fixed width
                            height: 400, // Set a fixed height
                            margin: '10px',
                            display: 'inline-block',
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '8px',
                            transition: 'transform 0.2s, box-shadow 0.2s', // Add transition for smooth effect
                            '&:hover': {
                                transform: 'scale(1.05)', // Slightly scale up the card
                                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)', // Add a shadow on hover
                            }
                        }}
                        key={product.id}
                    >
                        <IconButton
                            sx={{ position: 'absolute', top: 0, right: 0, padding: 1 }}
                            onClick={() => handleDelete(product._id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                        <CardContent sx={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
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
            )}
        </>
    );
};

export default ProductSummary;
