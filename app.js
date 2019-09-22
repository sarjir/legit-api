const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const { GraphQLDate } = require("graphql-iso-date");
const { ApolloServer, gql } = require("apollo-server");
const assert = require("assert");
const { makeExecutableSchema } = require("graphql-tools");

const dbUrl = "mongodb://database:27017";
const dbName = "legit";
const client = new MongoClient(dbUrl);
let db;

const typeDefs = gql`
  scalar Date

  type Article {
    title: String
    author: String
    publish_date: Date
  }

  input ArticleInput {
    title: String!
    author: String!
  }

  type Query {
    getArticle(id: String!): Article
  }

  type Mutation {
    addArticle(input: ArticleInput): Article
  }
`;

const resolvers = {
  Date: GraphQLDate,

  Query: {
    getArticle: (parent, { id }) => {
      return db
        .collection("articles")
        .findOne({ _id: new ObjectID(id) })
        .then((result, error) => {
          console.log("result", result);
          return result;
        });
    }
  },

  Mutation: {
    addArticle: async (parent, { input }) => {
      const article = {
        input,
        publish_date: new Date(Date.now())
      };
      const newArticle = await db.collection("articles").insertOne(article);

      return db.collection("articles").findOne({ _id: newArticle.insertedId });
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const server = new ApolloServer({ schema });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

client.connect(function(err) {
  console.log("connecting to database!");
  assert.equal(null, err);
  console.log("Database connected successfully");

  db = client.db(dbName);
});
