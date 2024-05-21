import { HashService } from '@app/hash';
import { PrismaService } from '@app/prisma';
import { UserEntity } from '@app/prisma/user.entity/user.entity';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
        private readonly hashService: HashService
    ) {
        this.init(
            "locnelor",
            "locnelor",
            "locnelor",
            2147483647
        )
    }

    public async init(
        account: string,
        name: string,
        password: string,
        role: number
    ) {
        if (await this.prismaService.user.findUnique({
            where: {
                account
            }
        })) return;
        await this.prismaService.user.create({
            data: {
                account,
                role,
                name,
                hash_key: this.hashService.createUid([name, account, password]),
                profile: {
                    create: {
                        password: this.hashService.cryptoPassword(password),

                    }
                }
            }
        })
    }

    public validateUser(account: string, password: string) {
        return this.prismaService.user.findUnique({
            where: {
                account,
                profile: {
                    password
                }
            },
            include: { profile: true }
        })
    }
    getToken(user: UserEntity) {
        const payload = {
            crypto: this.hashService.cryptoPassword(user.profile.password + user.loginIp),
            sub: user.id,
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
        if (this.hashService.cryptoPassword(user.profile.password + user.loginIp) !== crypto) throw ForbiddenException
        return user;
    }
}
