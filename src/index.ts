import { MikroORM } from '@mikro-orm/core';
import microConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import dotenv from 'dotenv';
import { __prod__ } from './constants';
import { MyContext } from './types';

dotenv.config();

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  const port = process.env.PORT || 8000;
  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();
  // app.use(cors());

  app.use(
    session({
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      name: 'qid',
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
      saveUninitialized: false,
      secret: process.env.REDIS_KEY || '',
      resave: false,
    })
  );
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => {
      return { em: orm.em, req, res };
    },
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: 'https://studio.apollographql.com',
      credentials: true,
    },
  });

  app.listen(port, () => console.log(`Server running on ${port} 😎`));
};

main().catch((error) => console.error(error));
