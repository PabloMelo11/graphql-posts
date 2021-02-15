import express from 'express';
import { ApolloServer, PubSub } from 'apollo-server-express';
import mongoose from 'mongoose';

import isAuth from './middlewares/is-auth';

function startServer({ typeDefs, resolvers }) {
  mongoose.connect('mongodb://localhost:27017/graphql', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const app = express();

  app.use(isAuth);

  const pubsub = new PubSub();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      req,
      pubsub,
    }),
  });

  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('Server is running');
  });
}

export default startServer;
