import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import typeDefs from './schema';
// import resolvers from './resolvers';
import context from './context';

import config from './config';

const app = express();
app.use(
  cors({
    origin: config.frontendOrigins,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.set('trust proxy', true);

const main = async () => {
  const uri = `mongodb+srv://${config.db.username}:${config.db.password}@cluster0.padn7.gcp.mongodb.net/${config.db.dbName}?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(config.db.dbName);

  const server = new ApolloServer({
    typeDefs,
    // resolvers,
    context: ({ req, res }) => context({ req, res, client, db }),
    // mocks: !config.isProd,
    // mockEntireSchema: false,
    playground: !config.isProd,
    introspection: !config.isProd,
  });
  server.applyMiddleware({ app, path: '/api/graphql', cors: false });

  app.listen(config.port, config.host, () => {
    console.log(`🚀  Server ready at http://${config.host}:${config.port}${server.graphqlPath}`);
  });
};
main();
