import { ObjectType, Field } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
// typeorm으로 db저장
@Entity()
export class Restaurant {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  @IsString()
  @Length(5, 10)
  name: string;

  @Field(() => Boolean, { nullable: true })
  @Column({ default: true })
  @IsBoolean()
  @IsOptional()
  isVegan?: boolean;

  @Field(() => String)
  @Column()
  @IsString()
  address: string;
}
