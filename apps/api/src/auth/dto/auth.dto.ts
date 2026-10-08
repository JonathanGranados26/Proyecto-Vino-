import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field()
  email: string;

  @Field()
  role: string;
}