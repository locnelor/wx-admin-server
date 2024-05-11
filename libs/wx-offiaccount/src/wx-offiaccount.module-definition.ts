import { ConfigurableModuleBuilder } from '@nestjs/common';
import { WxOffiaccountModuleOptions } from './wx-offiaccount.module.interface';


export const { ConfigurableModuleClass: WxOffiaccountConfigurableModule, MODULE_OPTIONS_TOKEN: WXOFFIACCOUNT_MODULE_OPTIONS_TOKEN } =
    new ConfigurableModuleBuilder<WxOffiaccountModuleOptions>({ moduleName: 'Request' })
        .build();
