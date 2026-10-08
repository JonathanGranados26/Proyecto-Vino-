import { InputType, Field, Float, ID } from '@nestjs/graphql';

@InputType()
export class UpdateProductInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  brand?: string;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  presentation?: string;

  @Field(() => Float, { nullable: true })
  alcoholicDegree?: number;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field({ nullable: true })
  currency?: string;

  @Field({ nullable: true })
  stock?: number;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  region?: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => [String], { nullable: true })
  images?: string[];  // ← NUEVO

  @Field({ nullable: true })
  isActive?: boolean;

  @Field(() => [String], { nullable: true })
  tastingNotes?: string[];
}