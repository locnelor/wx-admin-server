import { Controller, Get, Ip, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisCacheService } from '@app/redis-cache';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redis: RedisCacheService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("set")
  set(
    @Query("key") key: string,
    @Query("value") value: string,
    @Query("ttl") ttl?: string
  ) {
    return this.redis.set(value, key, Number(ttl))
  }

  @Get("get")
  get(
    @Query("key") key: string
  ) {
    return this.redis.get(key);
  }

}
