import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from './jwt.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtMiddelware implements NestMiddleware {
  //Injectable일때만 inject가능
  constructor(
    private readonly jwtService: JwtService,
    //global하지 않은 Injection(Service등..)은 그냥 inject하면 에러가 발생된다.
    //그러면 userService는 userModule이 가지고 있고,
    //처음에는 userModule에서 아무것도 exports하고있지 않기때문에 에러가 발생되는것임.
    private readonly usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];

      try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const user = await this.usersService.findById(decoded['id']);

          //middleware에서 다음 proccess에 request로 값을 넘겨줄때 사용하는 방법
          req['user'] = user;
        }
      } catch (error) {}
    }
    next();
  }
}
