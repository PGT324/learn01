import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entites/user.entity';
import { CreateAccount, CreateAccountOutput } from './dtos/create-account.dto';
import { Login, LoginOutput } from './dtos/login.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => Boolean)
  hi() {
    return true;
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
}
