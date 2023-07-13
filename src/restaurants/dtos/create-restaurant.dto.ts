// Mutation에서 Args로 하나씩 데이터를 받을 수도 있지만 Object로 한번에 (entity)모델정보를 받아올 수 있는데
// 그럴때 InputType을 사용한다. 그리고 그럴때 dto를 만들어서 사용한다.
import { InputType, ArgsType, Field } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';

@ArgsType()
export class CreateRestaurantDto {
  @Field(() => String)
  @IsString()
  @Length(5, 10)
  name: string;

  @Field(() => Boolean)
  @IsBoolean()
  isVegan: boolean;

  @Field(() => String)
  @IsString()
  address: string;

  @Field(() => String)
  @IsString()
  ownerName: string;
}
