import { PrismaService } from '@app/prisma';
import { WxOffiaccountService } from '@app/wx-offiaccount';
import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class EventService {
    constructor(
        private readonly wxOffiaccount: WxOffiaccountService,
        private readonly authService: AuthService
    ) { }
    public async handle(data: any) {
        if (data.Ticket) {
            return await this.ticket(data);
        }
        return this.sendMsg(data, "helloWorld");
    }


    public sendMsg({ FromUserName, ToUserName }, message = "") {
        return `<xml>
                <ToUserName><![CDATA[${FromUserName}]]></ToUserName>
                <FromUserName><![CDATA[${ToUserName}]]></FromUserName>
                <CreateTime>${new Date().getTime()}</CreateTime>
                <MsgType><![CDATA[text]]></MsgType>
                <Content><![CDATA[${message}]]></Content>
            </xml>
            `;
    }

    private async ticket({ FromUserName, Ticket, ToUserName }) {
        await this.authService.scanQrcode(Ticket, FromUserName);
        return ""
    }



}
