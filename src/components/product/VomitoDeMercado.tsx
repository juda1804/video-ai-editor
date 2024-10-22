import React, { useState } from 'react'; // Import useState for managing state
import TextField from '@mui/material/TextField'; // Import TextField from Material-UI
import Typography from '@mui/material/Typography'; // Import Typography for text
import Box from '@mui/material/Box'; // Import Box for layout

const VomitoDeMercado: React.FC<{ vomitoMercado: string, setVomitoMercado: (vomitoMercado: string) => void }> = ({ vomitoMercado, setVomitoMercado }) => {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVomitoMercado(event.target.value); // Update product state
    };

    return (
        <Box>
            <Typography variant="h4">Vomito de mercado</Typography>
            <TextField
                multiline
                rows={20} 
                variant="outlined"
                fullWidth
                placeholder="Type your text here..."
                style={{ height: '100%' }} 
                value={vomitoMercado} 
                onChange={handleChange} 
            />
            <Typography variant="body1" style={{ marginTop: '10px' }}>
                Character count: {vomitoMercado.length}
            </Typography>
        </Box>
    );
}

export default VomitoDeMercado;
