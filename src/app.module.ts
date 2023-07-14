import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// joi처럼 js로 구성된 친구를 import할때는 alias를 사용한다.
// joi는 유효성 검사 tool이다. (env등이 설정되있지 않으면 앱을 실행하지 않게 한다.)
import * as Joi from 'joi';
import { Restaurant } from './restaurants/entities/restaurants.entity';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { User } from './users/entites/user.entity';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [
    //dotenv/ config 모듈 설정
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',

      //joi 유효성 검사 - env에 속성이 설정되어있지 않으면 실행되지않음(error 발생)
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        //JWT(토큰생성)
        TOKEN_SECRET: Joi.string().required(),
      }),
    }),
    //typeorm 설정
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      logging: true,
      //typeorm -> entity에서 Entity, Column, PrimaryKey 설정 -> app.module에서 entities설정!
      entities: [User],
    }),
    //graphql code-first
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    UsersModule,
    CommonModule,
    JwtModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
