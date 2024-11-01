const { SalesAngleGenerator } = require('../agents/SalesAngleGenerator');
const logger = require('../logger')('salesAnglesController');

const generateSalesAnglesHandler = async (req, res) => {
    try {
        const { description } = req.body;
        
        if (!description) {
            return res.status(400).json({ 
                message: 'La descripción del producto es requerida' 
            });
        }

        const angles = await SalesAngleGenerator.generateSalesAngles(description);
        res.status(200).json({ angles });
    } catch (error) {
        logger.error(`Error generating sales angles: ${error.message}`, error);
        res.status(500).json({ 
            message: 'Error al generar los ángulos de venta', 
            error: error.message 
        });
    }
};

module.exports = {
    generateSalesAnglesHandler
}; 