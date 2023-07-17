import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccount } from './dtos/create-account.dto';
import { Login } from './dtos/login.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput } from './dtos/edit-profile-dto';
import { Verification } from './entites/verification.entity';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verification: Repository<Verification>,
    //jwt토큰 설정을 위한 변수설정
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
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
      const result = await this.users.save(user);
      const verification = await this.verification.save(
        this.verification.create({
          user: result,
        }),
      );
      this.emailService.sendVerificationEmail(verification.code);
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
      const user = await this.users.findOne({
        where: { email },
        //email verify 과정에서 user entity의 password를 select:false로 해놨기 때문에,
        //정확히 select한다고 알려줘야된다 (password를)
        //그리고 select를 사용하면 다른값은 안넘어오기 때문에 필요한 값이 있다면 같이 select해줘야한다.
        select: ['id', 'password'],
      });
      console.log(user);
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
      // jwtmodule을 자체적으로 생성하고 나서는 this.jwtService를 사용한다.
      const token = this.jwtService.sign(user.id);

      return { ok: true, token: token };
    } catch (error) {
      return { ok: false, error: error };
    }
  }

  async findById(id: number): Promise<User> {
    return this.users.findOne({ where: { id } });
  }

  async editProfile(
    userId: number,
    editProfileInput: EditProfileInput,
  ): Promise<User> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (editProfileInput.email) {
      user.email = editProfileInput.email;
      user.verified = false;
      const verification = await this.verification.save(
        this.verification.create({ user }),
      );
      this.emailService.sendVerificationEmail(verification.code);
    }
    if (editProfileInput.password) {
      user.password = editProfileInput.password;
    }
    return await this.users.save(user);
  }

  async verifyEmail(code: string): Promise<boolean> {
    try {
      const verification = await this.verification.findOne({
        where: { code: code },
        //relations를 사용하면 외래키로 묶여있는 테이블의 정보를 같이 가져올 수 있다. (join문 이랑 비슷한듯)
        relations: ['user'],
      });
      if (verification) {
        verification.user.verified = true;
        console.log(verification.user);
        await this.users.save(verification.user);
        await this.verification.delete(verification.id);
        return true;
      }
      throw new Error();
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
