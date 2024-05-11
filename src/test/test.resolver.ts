import { WxOffiaccountService } from '@app/wx-offiaccount';
import { Args, Field, Mutation, Resolver } from '@nestjs/graphql';


class TestWechatResult {
    constructor(
        msg: string
    ) {
        this.result = msg;
    }
    @Field()
    result: string
}
@Resolver()
export class TestResolver {
    constructor(
        private readonly wxOffiaccount: WxOffiaccountService
    ) { }

    @Mutation(() => TestWechatResult)
    async testWechar(
        @Args("method") method: string,
        @Args("url") url: string,
        @Args("query", { nullable: true }) query?: string,
        @Args("body", { nullable: true }) body?: string
    ) {
        const f = method === "GET" ? this.wxOffiaccount.get : this.wxOffiaccount.post
        const d = method === "GET" ? query : body;
        let s = {};
        try {
            s = JSON.parse(d);
        } catch (e) { }

        const result = await f(url, s);
        return new TestWechatResult(JSON.stringify(result));
    }
}
