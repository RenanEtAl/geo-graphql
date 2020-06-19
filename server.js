const { ApolloServer } = require("apollo-server");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

const mongoose = require("mongoose");
const { findOrCreateUser } = require("./controllers/user.controller");

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connected!"))
  .catch((err) => console.error(err));

new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;
    try {
      authToken = req.headers.authorization;
      if (authToken) {
        // find the user in db
        // or create user
        currentUser = await findOrCreateUser(authToken);
      }
    } catch (err) {
      console.err(`Unable to authentica user with token ${authToken}`);
    }
  },
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
