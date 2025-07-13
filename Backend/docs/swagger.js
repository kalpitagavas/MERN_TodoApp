const swaggerui = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo App API",
      version: "1.0.0",
      description: "API documentation for Todo App backend",
    },
    servers: {
      url: "http://localhost/8080",
    },
  },
  apis: ["./router/*.js"],
};
const specs = swaggerJsDoc(options);
module.exports = { specs, swaggerui };
