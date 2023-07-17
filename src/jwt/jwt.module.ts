import { DynamicModule, Module, Global } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { CONFIG_OPTIONS } from '../common/common.constants';
import { JwtModuleOptions } from './jwt.interfaces';

@Module({})
@Global()
export class JwtModule {
  // jwt의 static함수 구현해보기 / dynamic module
  static forRoot(options: JwtModuleOptions): DynamicModule {
    // 이 return값이 dynamick module이다.
    return {
      module: JwtModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        JwtService,
      ],
      exports: [JwtService],
    };
  }
}
