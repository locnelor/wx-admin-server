import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as Joi from "joi"
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RedisCacheModule } from '@app/redis-cache';
import { WxOffiaccountModule } from '@app/wx-offiaccount';
import { EventModule } from './event/event.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string(),
        TITLE: Joi.string().default("title"),
        DESCRIPTION: Joi.string().default("description"),
        VERSION: Joi.string().default("1.0"),
        EXPIRES_IN: Joi.number().default(60 * 60 * 24 * 14),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_HOST: Joi.string().default("localhost"),
        REDIS_PASSWORD: Joi.string(),
        CACHE_TTL: Joi.number().default(6 * 60 * 60),
        REDIS_DB: Joi.number(),
        WX_APPID: Joi.string(),
        WX_SECRET: Joi.string(),
      }),
      envFilePath: ".env"
    }),
    WxOffiaccountModule.registerAsync({
      useFactory(config: ConfigService) {
        return {
          appid: config.getOrThrow("wx_offiaccount_appid"),
          secret: config.getOrThrow("wx_offiaccount_secret")
        }
      },
      inject: [ConfigService],
      imports: [ConfigModule]
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      subscriptions: {
        'graphql-ws': {
          onConnect: (context: any) => {
            const {
              connectionParams,
              extra
            } = context;
            const { Authorization } = connectionParams;
            extra.Authorization = Authorization;
          },
        }
      },
      autoSchemaFile: join(process.cwd(), 'prisma/schema.gql'),
      definitions: {
        path: join(__dirname, 'types/graphql.ts'),
      },
      playground: true,
      context: ({ req, connection = {} as any, extra }) => {
        const raw = (req || connection.context || extra.request)
        if (!!extra?.Authorization && !!raw.headers && !raw.headers.authorization) {
          raw.headers.authorization = extra?.Authorization
        }
        return {
          req: raw,
          trackErrors(errors) {
            console.log(errors)
          },
        };
      },
    }),
    RedisCacheModule,
    AuthModule,
    UserModule,
    EventModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
