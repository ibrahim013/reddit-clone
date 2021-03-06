import { Post } from './../entities/post';
import { MyContext } from 'src/types';
import { Resolver, Query, Ctx, Mutation, Arg, Int } from 'type-graphql';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }
  @Query(() => Post, { nullable: true })
  post(
    @Arg('id', () => Int) id: number, 
    @Ctx() { em }: MyContext): Promise<Post | null> {
    return em.findOne(Post, id);
  }
  @Mutation(() => Post)
  async createPost(
    @Arg('title') title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }
}
