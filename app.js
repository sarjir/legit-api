var express = require("express");
var graphqlHTTP = require("express-graphql");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
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
    getArticle(id: String!): Article
  }
`);

var root = {
  getArticle: ({ id }) => {
    return db
      .collection("articles")
      .findOne({ _id: new ObjectID(id) })
      .then((result, error) => {
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
