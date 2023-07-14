import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entites/user.entity';
import { CommonOutput } from 'src/common/dtos/output.dto';

@InputType()
export class CreateAccount extends PickType(
  User,
  ['email', 'password', 'role'],
  InputType,
) {}

// common폴더에 dtos 생성해서 공통적인 output(출력값)을 복사하고 여기에서는 상속으로 받아주게 변경
@ObjectType()
export class CreateAccountOutput extends CommonOutput {}
