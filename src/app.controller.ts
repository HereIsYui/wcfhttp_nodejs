import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { cbData, msgData } from 'types/msg';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/msg_cb')
  msgCallback(@Body() body: msgData): Promise<cbData> {
    return this.appService.msgCallback(body);
  }
}
