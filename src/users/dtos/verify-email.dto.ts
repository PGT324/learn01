import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { Verification } from '../entites/verification.entity';

@InputType()
export class VerifyEmailInput extends PickType(
  Verification,
  ['code'],
  InputType,
) {}

@ObjectType()
export class VerifyEmailOutput extends CommonOutput {}
