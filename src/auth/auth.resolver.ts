import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard, GqlCurrentUser } from './auth.guard';
import { ForbiddenError } from '@nestjs/apollo';
import { AuthService } from './auth.service';
import { PrismaService } from '@app/prisma';
import { UserEntity } from '@app/prisma/user.entity/user.entity';
import { HashService } from '@app/hash';

@Resolver(of => UserEntity)
export class AuthResolver {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly authService: AuthService,
        private readonly hashService: HashService
    ) { }

    @Query(() => UserEntity)
    @UseGuards(GqlAuthGuard)
    viewer(
        @GqlCurrentUser() user: UserEntity
    ) {
        return user;
    }

    @Mutation(() => UserEntity)
    async auth(
        @Args("account") account: string,
        @Args("password") password: string,
        @Context() { req: { ip } }
    ) {
        const find: UserEntity = await this.prismaService.user.findUnique({
            where: {
                account,
                profile: {
                    password: this.hashService.cryptoPassword(password)
                }
            },
            include: {
                profile: true
            }
        })
        if (!find) throw ForbiddenError
        const user: UserEntity = await this.prismaService.user.update({
            where: {
                id: find.id
            },
            data: {
                loginIp: ip
            },
            include: {
                profile: true
            }
        })
        user.token = this.authService.getToken(user).access_token
        return user;
    }
}
