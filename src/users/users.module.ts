import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { Verification } from './entites/verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])],
  //jwt 토큰 설정 -> ConfigService를 providers에 추가
  //global module로 설정되어있으면 im
  providers: [UsersResolver, UsersService],
  //global하게 정해지지 않은 Injection을 사용하려면 export해줘야됨.
  exports: [UsersService],
})
export class UsersModule {}
