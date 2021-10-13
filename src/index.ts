import { MikroORM } from '@mikro-orm/core';
import microConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up();
  const port = process.env.PORT || 8000;
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(port, () => console.log(`Server running on ${port} 😎`));
};

main();
