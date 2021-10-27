import argon2 from 'argon2';
import { User } from './../entities/user';
import { MyContext } from 'src/types';
import {
  Resolver,
  Mutation,
  InputType,
  Field,
  Arg,
  Ctx,
  ObjectType,
} from 'type-graphql';

@InputType()
class UserInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg('options') options: UserInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const isUser = await em.findOne(User, { username: options.username });
    if (isUser) {
      return {
        errors: [
          {
            field: 'username',
            message: 'username already exist',
          },
        ],
      };
    }
    const passwordHash = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: passwordHash,
    });
    try {
      await em.persistAndFlush(user);
      return { user };
    } catch (error) {
      return {
        errors: [
          {
            field: 'server error',
            message: 'server error',
          },
        ],
      };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UserInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const isUser = await em.findOne(User, { username: options.username });
    if (!isUser) {
      return {
        errors: [
          {
            field: 'username',
            message: 'username or password not correct',
          },
        ],
      };
    }
    const isPassword = await argon2.verify(isUser.password, options.password);
     
    if (!isPassword) {
      return {
        errors: [
          {
            field: 'username/password',
            message: 'username or password not correct',
          },
        ],
      };
    }
    req.session.userId = isUser.id
    console.log(req.session, "session")
    return {
      user: isUser,
    };
  }
}
