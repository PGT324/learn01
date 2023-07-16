import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { User } from '../entites/user.entity';

@ArgsType()
export class UserProfileInput {
  @Field(() => Number)
  userId: number;
}

@ObjectType()
export class UserProfileOutput extends CommonOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
