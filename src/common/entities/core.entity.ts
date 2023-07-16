import { Field, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// 공통적인 entity 속성들을 정의한 부분이다.
@ObjectType()
@Entity()
export class CoreEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;
}
