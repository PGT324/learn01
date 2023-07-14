// Mutation에서 Args로 하나씩 데이터를 받을 수도 있지만 Object로 한번에 (entity)모델정보를 받아올 수 있는데
// 그럴때 InputType을 사용한다. 그리고 그럴때 dto를 만들어서 사용한다.
import { InputType, OmitType } from '@nestjs/graphql';
import { Restaurant } from '../entities/restaurants.entity';

@InputType()
export class CreateRestaurantDto extends OmitType(
  Restaurant,
  ['id'],
  InputType,
) {
  // entity에는 추가했는데, dto에는 없는 컬럼을 db에 입력할때는 에러가 발생한다.
  // 그러면 추가될때마다 계속 dto에도 추가로 작성해야할까
  // mapped type을 사용하면 entity에서 dto까지 자동으로 설정할 수 있다. (partial, pick, omit, intersection)
  // @Field(() => String)
  // @IsString()
  // categoryName: string;
  // -----------------------------------------------------------
  // Partial -> 다 사용
  // Pick -> 골라 사용
  // Omit -> 제외해서 사용
  // intersection -> 두개의 input을 합쳐서 사용
  // -----------------------------------------------------------
  // 그러면 Validation은?
  // entity에서 똑같이 하면됨.
}
