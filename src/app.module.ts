import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// joi처럼 js로 구성된 친구를 import할때는 alias를 사용한다.
// joi는 유효성 검사 tool이다. (env등이 설정되있지 않으면 앱을 실행하지 않게 한다.)
import * as Joi from 'joi';
import { UsersModule } from './users/users.module';
import { User } from './users/entites/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddelware } from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';
import { Verification } from './users/entites/verification.entity';
import { EmailModule } from './email/email.module';

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
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_FROM_EMAIL: Joi.string().required(),
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
      entities: [User, Verification],
    }),
    //graphql code-first
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      // graphql context에 user key를 가진 http를 보낸다.
      context: ({ req }) => ({ user: req['user'] }),
    }),
    UsersModule,
    JwtModule.forRoot({
      privateKey: process.env.TOKEN_SECRET,
    }),
    AuthModule,
    EmailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN_NAME,
      fromEmail: process.env.MAILGUN_FROM_EMAIL,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddelware)
      .forRoutes({ path: '/graphql', method: RequestMethod.POST });
  }
}
