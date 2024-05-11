import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { User } from "@prisma/client";
import { ProfileEntity } from "../profile.entity/profile.entity";

@ObjectType()
export class UserEntity extends BaseEntity implements User {
    openid: string;

    @Field()
    hash_key: string;

    @Field(() => Int)
    role: number;

    @Field(() => Int)
    profileId: number;

    @Field(() => ProfileEntity, { nullable: true })
    profile: ProfileEntity

    @Field({ nullable: true })
    token?: string
}
