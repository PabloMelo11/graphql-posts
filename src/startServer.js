import http from 'http';
import express from 'express';
import { ApolloServer, PubSub } from 'apollo-server-express';
import mongoose from 'mongoose';

import isAuth from './middlewares/is-auth';

function startServer({ typeDefs, resolvers }) {
  mongoose.connect('mongodb://localhost:27017/graphql', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const PORT = 4000;
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

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
    );
  });
}

export default startServer;
