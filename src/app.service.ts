import { Injectable } from '@nestjs/common';
import { cbData, msgData, contactsData, sendMsgData } from 'types/msg';
import axios from 'axios';
import { configInfo as conf } from 'config/conf';

@Injectable()
export class AppService {
  contacts: contactsData[];
  constructor() {
    this.contacts = [];
  }
  getHello(): string {
    return '当你看到这条消息，说明机器人启动成功了！';
  }
  async msgCallback(data: msgData): Promise<cbData> {
    if (data.is_group && conf.listenlist.includes(data.roomid)) {
      if (data.content === 'wxid') {
        let wxid = await this.getContact(data.sender);
        console.log(wxid);
        this.sendMessage({
          msg: '@' + wxid + ' 的wxid是: ' + data.sender,
          receiver: data.roomid,
          aters: data.sender,
        });
      }
    }
    return {
      code: 200,
      message: '成功',
    };
  }
  async getAllContacts() {
    let res = await axios({
      url: conf.wcfhttp + '/sql',
      method: 'post',
      data: {
        db: 'MicroMsg.db',
        sql: 'SELECT UserName as wxid, NickName FROM Contact;',
      },
    });
    if (res.data.status == 0) {
      this.contacts = res.data.data.bs64;
    }
  }
  async getContact(wxid: string) {
    if (this.contacts.length == 0) {
      await this.getAllContacts();
    }
    return this.contacts.find((user) => user.wxid === wxid).NickName;
  }
  async sendMessage(data: sendMsgData) {
    let res = await axios({
      url: conf.wcfhttp + '/text',
      method: 'post',
      data: {
        msg: data.msg,
        receiver: data.receiver,
        aters: data.aters,
      },
    });
    console.log(res.data);
  }
}
