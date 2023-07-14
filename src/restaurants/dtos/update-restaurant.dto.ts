import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateRestaurantDto } from './create-restaurant.dto';

@InputType()
export class UpdateRestaurantDtoInputType extends PartialType(
  // entity대신에 dto를 가져와도 된다.
  // Restaurant 대신에 CreateRestaurantDto를 사용 하는 이유는 id를 update의 옵션으로 사용하고 싶지
  // 않아서 이다.
  CreateRestaurantDto,
  InputType,
) {}

// resolver에서 Args를 여러개 쓰지 않으려고 작성(여기서는 id)
@InputType()
export class UpdateRestaurantDto {
  @Field(() => Number)
  id: number;

  @Field(() => UpdateRestaurantDtoInputType)
  data: UpdateRestaurantDtoInputType;
}
