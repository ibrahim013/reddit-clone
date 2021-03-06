import { __prod__ } from './constants';
import { Post } from './entities/post';
import { MikroORM } from '@mikro-orm/core';
import path from 'path';
import dotenv from 'dotenv';
import { User } from './entities/user';

dotenv.config();

export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  type: 'postgresql',
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
