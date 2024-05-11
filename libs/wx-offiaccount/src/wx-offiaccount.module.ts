import { Global, Module } from '@nestjs/common';
import { WxOffiaccountService } from './wx-offiaccount.service';
import { WxOffiaccountConfigurableModule } from './wx-offiaccount.module-definition';
import { RequestModule } from '@app/request';

@Module({
  imports: [RequestModule.register({
    baseUrl: 'https://api.weixin.qq.com/cgi-bin/'
  })],
  providers: [WxOffiaccountService],
  exports: [WxOffiaccountService],
})
@Global()
export class WxOffiaccountModule extends WxOffiaccountConfigurableModule {
  declare static register: typeof WxOffiaccountConfigurableModule.register;
  declare static registerAsync: typeof WxOffiaccountConfigurableModule.registerAsync;
}