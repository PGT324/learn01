import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entites/user.entity';
import { CreateAccount, CreateAccountOutput } from './dtos/create-account.dto';
import { Login, LoginOutput } from './dtos/login.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile-dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => Boolean)
  hi() {
    return true;
  }

  @Query(() => User)
  // @Context -> app.module의 graphql에서 context옵션을 추가했을때 사용한다.
  // @UseGuards -> 가드를 사용하기 위해서 필요한 데코
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @UseGuards(AuthGuard)
  @Query(() => UserProfileOutput)
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    try {
      const user = await this.usersService.findById(userProfileInput.userId);
      if (!user) {
        throw Error();
      }
      return {
        ok: Boolean(user),
        user,
      };
    } catch (error) {
      return {
        error: '찾으시는 유저가 없습니다.',
        ok: false,
      };
    }
  }

  @Mutation(() => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccount: CreateAccount,
  ): Promise<CreateAccountOutput> {
    const [ok, error] = await this.usersService.createAccount(createAccount);
    // 이 Mutation은 error를 중심으로 처리하는 함수이다.(계정생성이 되면 return값이 없으니까)
    return {
      ok,
      error,
    };
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') login: Login): Promise<LoginOutput> {
    try {
      return await this.usersService.login(login);
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => EditProfileOutput)
  async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      await this.usersService.editProfile(authUser.id, editProfileInput);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Mutation(() => VerifyEmailOutput)
  async verifyEmail(
    @Args('input') verifyEmailInput: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    try {
      await this.usersService.verifyEmail(verifyEmailInput.code);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
