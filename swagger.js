const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = [
  "./src/controllers/auth.js",
  "./src/controllers/user.js",
  "./src/controllers/poll.js",
];

const doc = {
  swagger: "2.0",
  info: {
    version: "0.0.1",
    title: "Pollar API",
    description: "REST API for a voting application",
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Users",
      description: "API for users in the system",
    },
    {
      name: "Auth",
      description: "User authentication",
    },
  ],
  securityDefinitions: {
    api_key: {
      type: "apiKey",
      name: "api_key",
      in: "header",
    },
  },
  definitions: {
    User: {
      id: 1,
      username: "jhonDoe",
      first_name: "Jhon",
      last_name: "Doe",
      email: "jhon.doe@email.com",
      password: "secret",
      cpf: "12345678901",
      activated: 1,
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./src/app.js");
});
