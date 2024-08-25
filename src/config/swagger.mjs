import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            descroption: 'CBA Beckend Documentation for API'
        },
        servers: [
            {
                url: `http://localhost:3000`
            },
        ],
    },
    apis: ['./routes/*.mjs'], //Path to the API docs
}

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
