const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = [
  "./src/controllers/auth.js",
  "./src/controllers/user.js",
  "./src/controllers/poll.js",
  "./src/controllers/question.js",
  "./src/controllers/option.js",
  "./src/controllers/voter.js",
  "./src/controllers/vote.js",
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
      name: "Polls",
      description: "API for Polls in the system",
    },
    {
      name: "Questions",
      description: "API for Questions in the system",
    },
    {
      name: "Options",
      description: "API for Options in the system",
    },
    {
      name: "Voters",
      description: "API for Voters in the system",
    },
    {
      name: "Votes",
      description: "API for adding a vote in the system",
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
      privacy: 1,
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
    Option: {
      id: 1,
      name: "teste",
      description: "Descrição",
      type: 1,
      votes_count: 1,
      activated: 1,
      createdAt: "2022-01-01 00:00:00",
      updatedAt: "2022-01-01 00:00:00",
      questionId: 1,
    },
    Voter: {
      id: 1,
      name: "Jane",
      email: "email@email.com",
      voter_key: "L25WNC0A",
      vote_weight: 1,
      has_voted: true,
      activated: 1,
      createdAt: "2022-01-01 00:00:00",
      updatedAt: "2022-01-01 00:00:00",
      pollId: 1,
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./src/app.js");
});
