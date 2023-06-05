import { Injectable } from '@nestjs/common';
import { cbData, msgData, contactsData, sendMsgData } from 'types/msg';
import axios from 'axios';
import { configInfo as conf } from 'config/conf';
import { LOGGER } from 'utils/logger';
import { MoreThan, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity';
import { GlobalRulesList } from 'utils/rules';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
  contacts: contactsData[];
  constructor(@InjectRepository(User) private readonly user: Repository<User>) {
    this.contacts = [];
  }
  getHello(): string {
    return '当你看到这条消息，说明机器人启动成功了！';
  }
  async msgCallback(data: msgData): Promise<cbData> {
    if (data.is_group && conf.listenlist.includes(data.roomid)) {
      LOGGER.Log(`收到来自${data.sender}的消息:${data.content}`)
      let IceNet = this;
      for (let r of GlobalRulesList) {
        if (r.rule.test(data.content)) {
          let callback = await r.func(data, IceNet);
          if (callback) {
            IceNet.sendMessage({
              msg: callback.msg,
              receiver: callback.receiver,
              aters: callback.aters
            })
          }
          break;
        }
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
    let user = this.contacts.find((user) => user.wxid === wxid);
    if (this.contacts.length == 0 || !user) {
      await this.getAllContacts();
      user = this.contacts.find((user) => user.wxid === wxid);
    }
    return user.NickName;
  }
  sendMessage(data: sendMsgData) {
    axios({
      url: conf.wcfhttp + '/text',
      method: 'post',
      data: {
        msg: data.msg,
        receiver: data.receiver,
        aters: data.aters,
      },
    });
  }
  @Cron('0 0 0 * * *')
  resetSignin() {
    this.user.update({ is_signin: 1 }, { is_signin: 0 })
  }
}
