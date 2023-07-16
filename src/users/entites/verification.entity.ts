import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';

// 회원가입시(계정생성), 회원이메일 수정(이메일 주소 변경)시에 이메일 인증을 가능하게 하려는 dto
@ObjectType()
@Entity()
// common모듈에서 공통적으로 정의된 CoreEntity를 상속해서 사용한다.
export class Verification extends CoreEntity {
  @Column()
  @Field(() => String)
  code: string;

  //User엔티티와 1:1관계를 맺어준다. 자식테이블이 되는곳에 JoinColumn을 작성하면 된다.
  // onDelete는 외래키로 묶여진 테이블(부모테이블)이 삭제될때 하위테이블도 같이 삭제해줄수있는 옵션을 준다.
  // ex) CASCADE
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  // code의 랜덤생성을 도와주는 uuid사용
  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
