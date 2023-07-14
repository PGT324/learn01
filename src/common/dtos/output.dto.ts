import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommonOutput {
  @Field(() => String, { nullable: true })
  // ?는 null값이 가능하게 해준다.
  error?: string;

  @Field(() => Boolean)
  ok: boolean;
}
