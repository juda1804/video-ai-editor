const cors = require('cors');

const corsOptions = {
    origin: (origin, callback) => {
        if (origin && origin.startsWith('http://localhost')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // If you're using cookies or authentication headers
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;