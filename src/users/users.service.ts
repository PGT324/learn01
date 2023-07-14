import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccount } from './dtos/create-account.dto';
import { Login } from './dtos/login.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    //jwt토큰 설정을 위한 변수설정
    private readonly config: ConfigService,
  ) {}

  async createAccount(
    createAccount: CreateAccount,
  ): Promise<[boolean, string?]> {
    const email = createAccount.email;
    // 이메일 중복 여부 확인
    try {
      const exists = await this.users.findOne({ where: { email } });
      if (exists) {
        // 같은 이메일 존재하면 에러 발생
        // string을 return
        return [false, '이메일이 존재합니다!'];
      }
      // 중복 이메일 없으면 유저 생성
      // undefined를 return
      const user = await this.users.create(createAccount);

      // 생성된 유저 db에 저장
      await this.users.save(user);
      return [true, '계정 생성 성공!'];
    } catch (error) {
      return [false, '에러 발생! 계정 생성이 불가합니다.'];
    }
    // 유저 생성 && 비밀번호 hash 생성
  }

  async login(
    login: Login,
  ): Promise<{ ok: boolean; error?: string; token?: string }> {
    const email = login.email;
    const password = login.password;
    try {
      //email에 해당되는 유저찾기
      const user = await this.users.findOne({ where: { email } });
      if (!user) {
        return { ok: false, error: '이메일에 일치하는 유저가 없습니다!' };
      }
      // pw체크하기
      const passwordOk = await user.checkPassword(password);
      if (!passwordOk) {
        return { ok: false, error: '패스워드가 일치하지 않습니다!' };
      }
      // token생성하기 -> private key(TOKEN_SECRET)를 process.env가 아니고 밑에처럼 사용할 수 있다.
      // ConfigService를 users.module에 추가해주었기 때문에
      const token = jwt.sign({ id: user.id }, this.config.get('TOKEN_SECRET'));

      return { ok: true, token: token };
    } catch (error) {
      return { ok: false, error: error };
    }
  }
}
