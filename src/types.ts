import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from 'express';
import { Session } from 'express-session';

export type SessionWithUser = Session & { userId?: string | {} };

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: SessionWithUser };
  res: Response;
};