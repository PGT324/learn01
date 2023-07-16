import { InputType, ObjectType, PickType, PartialType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { User } from '../entites/user.entity';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ['email', 'password'], InputType),
) {}

@ObjectType()
export class EditProfileOutput extends CommonOutput {}
