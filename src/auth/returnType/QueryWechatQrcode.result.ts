import { Field, Int, ObjectType } from "@nestjs/graphql";



@ObjectType()
export class QueryWechatQrcodeResult {
    constructor(
        status = 304,
        message = ""
    ) {
        this.status = status;
        this.message = message
    }

    @Field(() => Int)
    status: number

    @Field()
    message: string
}