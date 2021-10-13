import { MikroORM } from '@mikro-orm/core';
import microConfig from './mikro-orm.config';

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up();
};

main();
