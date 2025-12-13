import swaggerJSDoc from 'swagger-jsdoc';

// Define Swagger options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'LivePoll API',
      version: '1.0.0',
      description: 'API documentation for LivePoll',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1', // your server URL
      },
    ],
  },
  apis: ['./src/routes/v1/*.js'], // Path to the API docs
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;
