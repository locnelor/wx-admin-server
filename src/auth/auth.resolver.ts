import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard, GqlCurrentUser } from './auth.guard';
import { UserEntity } from '@app/prisma/user.entity/user.entity';
import { HashService } from '@app/hash';
import { WxOffiaccountService } from '@app/wx-offiaccount';
import { RedisCacheService } from '@app/redis-cache';
import { ConfigService } from '@nestjs/config';
import { QueryWechatQrcodeResult } from './returnType/QueryWechatQrcode.result';
import { AuthService } from './auth.service';
import { PrismaService } from '@app/prisma';

const authScene = "locnelor_wx_admin_login"
@Resolver(of => UserEntity)
export class AuthResolver {
    constructor(
        private readonly hashService: HashService,
        private readonly wxOffiaccount: WxOffiaccountService,
        private readonly redisService: RedisCacheService,
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
        private readonly prismaService: PrismaService
    ) { }

    @Query(() => UserEntity)
    @UseGuards(GqlAuthGuard)
    currentUser(
        @GqlCurrentUser() user: UserEntity
    ) {
        return user;
    }


    /**
     * 获取二维码，扫码登录系统用。
     */
    @Query(() => String)
    async getWechatQrcode() {
        /**
         * 检测是否拥有管理员账号
         * 若没有管理员账号，发放绑定管理员账号的二维码
         */
        
        const scene_str = this.hashService.createUid();
        const result = await this.wxOffiaccount.createQrcode({
            action_name: "QR_LIMIT_STR_SCENE",
            expire_seconds: this.configService.get("CACHE_TTL"),
            action_info: authScene,
            scene_str
        })
        const {
            ticket
        } = result
        return await this.authService.setQrcodeKey(ticket, authScene)
    }

    /**
     * 轮询登录状态
     */
    @Mutation(() => QueryWechatQrcodeResult, { nullable: true })
    async queryWechatQrcode(
        @Args("ticket") ticket: string,
    ) {
        const res: any = await this.redisService.get(ticket);
        console.log("queryWechatQrcode->", res)
        if (!res) return null;
        if (res.type !== "login") return null
        if (res.scene !== authScene) return null;
        const { data } = res;
        if (!data) return null;
        const { openid } = data;
        const user = await this.prismaService.user.findUnique({ where: { openid }, include: { profile: true } })
        await this.authService.clearQrcodeKey(ticket)
        if (!user) {
            return new QueryWechatQrcodeResult(
                403,
                "该账号没有权限"
            )
        }
        const { access_token } = this.authService.getToken(user);
        return new QueryWechatQrcodeResult(200, access_token)
    }
}
