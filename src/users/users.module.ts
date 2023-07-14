import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  //jwt 토큰 설정 -> ConfigService를 providers에 추가
  providers: [UsersResolver, UsersService, ConfigService],
})
export class UsersModule {}
