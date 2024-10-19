import React from 'react';
import TextField from '@mui/material/TextField'; // Import TextField from Material-UI

const VomitoDeMercado: React.FC = () => {
    return (
        <div style={{ height: '60vh' }}> {/* Set height to 60% of the viewport height */}
            <h1>Vomito de mercado</h1>
            <TextField
                multiline
                rows={20} // Adjust the number of rows as needed
                variant="outlined"
                fullWidth
                placeholder="Type your text here..."
                style={{ height: '100%' }} // Set TextField height to 100%
            />
        </div>
    );
}

export default VomitoDeMercado;
