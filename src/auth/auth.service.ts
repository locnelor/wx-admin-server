import { HashService } from '@app/hash';
import { PrismaService } from '@app/prisma';
import { UserEntity } from '@app/prisma/user.entity/user.entity';
import { RedisCacheService } from '@app/redis-cache';
import { WxOffiaccountService } from '@app/wx-offiaccount';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
        private readonly hashService: HashService,
        private readonly redisService: RedisCacheService,
        private readonly wxOffiaccount: WxOffiaccountService
    ) { }
    public validateUser(openid: string) {
        return this.prismaService.user.findUnique({
            where: {
                openid
            },
            include: {
                profile: true
            }
        })
    }
    getToken(user: UserEntity) {
        const payload = {
            crypto: this.hashService.cryptoPassword(user.openid),
            sub: user.id
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validate({ crypto, sub }) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: sub
            },
            include: {
                profile: true,
            }
        })
        if (!user) throw NotFoundException
        if (this.hashService.cryptoPassword(user.openid) !== crypto) throw ForbiddenException
        return user;
    }

    public async clearQrcodeKey(ticket: string) {
        await this.redisService.del(ticket);
    }

    public async setQrcodeKey(ticket: string, scene: string) {
        await this.redisService.set({
            type: "login",
            scene,
            data: null
        }, ticket);
        return ticket
    }

    public async scanQrcode(ticket: string, openid: string) {
        const mem: any = await this.redisService.get(ticket);
        if (!mem) return;
        const userInfo = await this.wxOffiaccount.getUserInfo(openid);
        mem.data = userInfo
        await this.redisService.set(mem, ticket)
    }

}
