import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
    constructor(
        private readonly eventService: EventService
    ) { }
    @Post("handle")
    async wxEventHandle(
        @Body() { xml },
        @Res() res: Response
    ) {
        res.status(200);
        const data: any = {};
        for (const item in xml) data[item] = xml[item][0];
        try {
            const body = await this.eventService.handle(data);
            res.send(body)
            return body
        } catch (e) {
            console.log("handleError->", e)
        }
        
        const body = this.eventService.sendMsg(data, "success")
        res.send(body)
        return body
    }
}
