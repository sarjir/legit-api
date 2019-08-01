var express = require("express");
var graphqlHTTP = require("express-graphql");
const MongoClient = require("mongodb").MongoClient;
var { buildSchema } = require("graphql");
const assert = require("assert");

const dbUrl = "mongodb://database:27017";
const dbName = "legit";
const client = new MongoClient(dbUrl);
let db;

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Article {
    title: String,
    author: String,
  }

  type Query {
    getArticles: [Article]
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  getArticles: () => {
    return db
      .collection("articles")
      .find()
      .toArray()
      .then((result, error) => {
        console.log("result", result);

        return result;
      });
  }
};

var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);
app.listen(4000);
console.log("Running a GraphQL API server at localhost:4000/graphql");

client.connect(function(err) {
  console.log("connecting to database!");
  assert.equal(null, err);
  console.log("Database connected successfully");

  db = client.db(dbName);
});
