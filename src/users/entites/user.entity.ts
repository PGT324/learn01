import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';

// Enum을 사용할 수 있다. 컬럼에 타입을 지정해 주어야함.
enum UserRole {
  CLIENT,
  OWNER,
  DELIVERY,
}

//graphql에서 enum 설정하기
registerEnumType(UserRole, { name: 'UserRole' });

@ObjectType()
@Entity()
// common모듈에서 공통적으로 정의된 CoreEntity를 상속해서 사용한다.
export class User extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsEmail()
  email: string;

  @Field(() => String)
  @Column({ select: false })
  @IsString()
  password: string;

  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @Field(() => Boolean)
  @Column({ default: false })
  @IsBoolean()
  verified: boolean;

  // 비밀번호 hash작업을 위한 entity function
  @BeforeInsert()
  // update작업을 할때도 비밀번호 hash를 해야되기때문에 사용
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(password, this.password);
      console.log(this.password);
      return ok;
    } catch (error) {
      console.log(error);
    }
  }
}
