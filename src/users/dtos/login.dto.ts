import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { User } from '../entites/user.entity';

@InputType()
export class Login extends PickType(User, ['email', 'password'], InputType) {}

@ObjectType()
export class LoginOutput extends CommonOutput {
  @Field(() => String, { nullable: true })
  token?: string;
}
