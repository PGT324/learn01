//repository(entity) 생성 후 접근하기 위하여 service 생성

import { Injectable } from '@nestjs/common';
import { Restaurant } from './entities/restaurants.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';

@Injectable()
export class RestaurantService {
  // service의 생성자(constructor)에는 repository(entity)가 추가되면된다.
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurant: Repository<Restaurant>,
  ) {}

  //resolver에서 get/post등의 메서드를 바로 작성해주었던 것을 service로 옮겨서 단계를 하나 더 추가했다.
  //async 메서드는 타입에 Promise를 추가해 주어야한다.
  getAll(): Promise<Restaurant[]> {
    return this.restaurant.find();
  }

  createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    const restaurant = this.restaurant.create(createRestaurantDto);
    return this.restaurant.save(restaurant);
  }

  updateRestaurant(updateRestaurantDto: UpdateRestaurantDto) {
    // update의 특징은 update를 할때 그냥 진행한다는 것이다. (테이블에 데이터가 있는지 확인을 안한다.)
    // 그래서 Promise로 데이터를 return 하는 특징이 되게 중요하다.
    // 암튼, 그래서 id를 없는 id로 입력해도 에러가 나지는 않는다.
    return this.restaurant.update(
      updateRestaurantDto.id,
      updateRestaurantDto.data,
    );
  }
}
