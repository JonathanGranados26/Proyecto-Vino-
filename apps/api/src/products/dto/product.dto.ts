import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class ProductType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  slug!: string;

  @Field()
  brand!: string;

  @Field()
  category!: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  presentation!: string;

  @Field(() => Float)
  alcoholicDegree!: number;

  @Field(() => Float)
  price!: number;

  @Field()
  currency!: string;

  @Field(() => Int)
  stock!: number;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  region?: string;

  @Field({ nullable: true })
  grape?: string;

  @Field(() => Int, { nullable: true })
  vintage?: number;

  @Field(() => Float, { nullable: true })
  score?: number;

  @Field({ nullable: true })
  pairing?: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => [String], { nullable: true })
  images?: string[];  // ← NUEVO

  @Field(() => [String], { nullable: true })
  tastingNotes?: string[];

  @Field()
  isActive!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}