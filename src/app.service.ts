import { Injectable } from '@nestjs/common';
import { cbData } from 'types/msg';
import axios from 'axios';

@Injectable()
export class AppService {
  getHello(): string {
    return '当你看到这条消息，说明启动成功了！';
  }
  msgCallback(data): cbData {
    console.log(data);
    if (data.is_group && data.roomid === '34751380743@chatroom') {
      if (data.content === 'wxid') {
        axios({
          url: 'http://127.0.0.1:9999/text',
          method: 'post',
          data: {
            msg: '你的wxid是：' + data.sender,
            receiver: data.sender,
            aters: data.sender,
          },
        });
      }
    }
    return {
      status: 0,
      message: '成功',
    };
  }
}
