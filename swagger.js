const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: 'company_web_server',
        description: 'Description'
    },
    host: 'localhost:3000',
    schemes: ['http']
};

const outputFile = './swagger-output.json';
const routes = [
    './app.js'
];

swaggerAutogen(outputFile, routes, doc);