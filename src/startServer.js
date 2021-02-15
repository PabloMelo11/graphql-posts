import express from 'express';
import { ApolloServer, PubSub } from 'apollo-server-express';
import mongoose from 'mongoose';

function startServer({ typeDefs, resolvers }) {
  mongoose.connect('mongodb://localhost:27017/graphql', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const app = express();
  const path = '/graphql';

  const pubsub = new PubSub();

  const server = new ApolloServer({ typeDefs, resolvers, context: { pubsub } });

  server.applyMiddleware({ app, path });

  app.listen(4000, () => {
    console.log('Server is running');
  });
}

export default startServer;
