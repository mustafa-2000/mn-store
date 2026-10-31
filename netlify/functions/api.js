const serverless = require("serverless-http");
const app = require("../../server/server");

module.exports.handler = serverless(app, {
  basePath: "/.netlify/functions/api",
});