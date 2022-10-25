const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = [
  "./src/controllers/auth.js",
  "./src/controllers/user.js",
  "./src/controllers/poll.js",
  "./src/controllers/question.js",
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
    {
      name: "Poll",
      description: "API for Polls in the system",
    },
    {
      name: "Question",
      description: "API for Questions in the system",
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
      createdAt: "2022-01-01 00:00:00",
      updatedAt: "2022-01-01 00:00:00",
    },
    Poll: {
      id: 1,
      title: "teste",
      initial_date: "2022-01-01 00:00:00",
      end_date: "2022-01-02 00:00:00",
      sharing_url: "/s9Xjk23Ac",
      description: "Descrição",
      started: 0,
      finished: 0,
      activated: 1,
      createdAt: "2022-01-01 00:00:00",
      updatedAt: "2022-01-01 00:00:00",
      userId: 1,
    },
    Question: {
      id: 1,
      name: "teste",
      description: "Descrição",
      type: 1,
      activated: 1,
      num_options: 4,
      createdAt: "2022-01-01 00:00:00",
      updatedAt: "2022-01-01 00:00:00",
      pollId: 1,
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./src/app.js");
});
