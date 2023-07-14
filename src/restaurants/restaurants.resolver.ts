import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurants.entity';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { RestaurantService } from './restaurants.service';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';

// 생성한 entity를 resolver의 argu로 집어넣음.
@Resolver(() => Restaurant)
export class RestaurantResolver {
  //RestaurantService를 생성자(constructor)에 포함 시켜준다. resolver에서 사용가능하게
  //근데 처음에 이것만 작성해주면 에러가 발생한다.
  //module에는 RestaurantService가 provide 되지 않아서 그렇다.
  constructor(private readonly restaurantService: RestaurantService) {}

  @Query(() => [Restaurant])
  //async 함수는 타입에 Promise를 추가해 주어야한다.
  restaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAll();
  }

  @Mutation(() => Boolean)
  async createRestaurant(
    @Args('input') createRestaurantDto: CreateRestaurantDto,
  ): Promise<boolean> {
    try {
      await this.restaurantService.createRestaurant(createRestaurantDto);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @Mutation(() => Boolean)
  async updateRestaurant(
    // @Args('id') id: number,
    // @Args('input')
    @Args('input')
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<boolean> {
    try {
      await this.restaurantService.updateRestaurant(updateRestaurantDto);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
