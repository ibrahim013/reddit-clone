import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Post {
  @PrimaryKey()
  id!: number;

  @Property({ type: Date })
  createdAt = new Date();

  @Property({ type: Date, onUpdate: () => new Date() })
  update = new Date();

  @Property()
  title!: string;
}
