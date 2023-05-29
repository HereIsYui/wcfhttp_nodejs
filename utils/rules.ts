/**
 * 对话 先不存数据库了 偷懒
 */
import { cbData, msgData } from 'types/msg';
import { User } from '../src/entities/user.entity';
export const GlobalRulesList = [
  {
    rule: /^wxid$/,
    func: async (data: msgData, IceNet: any) => {
      let user = await getUserInfo(data, IceNet);
      let nick_name = await IceNet.getContact(data.sender)
      let cb = {
        msg: '@' + nick_name + ' 的wxid是: 不告诉你了',
        receiver: data.roomid ? data.roomid : data.sender,
        aters: data.sender
      }
      return cb;
    }
  }, {
    rule: /^群签到$/,
    func: async (data: msgData, IceNet: any) => {
      let user = await getUserInfo(data, IceNet);
      let nick_name = await IceNet.getContact(data.sender)
      let cb = {
        msg: '',
        receiver: data.roomid ? data.roomid : data.sender,
        aters: data.sender
      }
      if (user.is_signin == 1) {
        let point = rand(0, 10);
        user.point = (user.point || 0) - point;
        cb.msg = `@${nick_name} 已经签到过啦!\n扣你${point}鱼皮, 剩余${user.point}鱼皮`
      } else {
        let point = rand(5, 20);
        user.point = (user.point || 0) + point;
        user.signin_times = (user.signin_times || 0) + 1;
        user.is_signin = 1;
        cb.msg = `@${nick_name} 签到成功!\n获得${point}鱼皮\n当前拥有${user.point}鱼皮\n连续签到${user.signin_times}天`
      }
      if (user.id) {
        await IceNet.user.update(user.id, user)
      }
      return cb;
    }
  }, {
    rule: /^查询鱼皮$/,
    func: async (data: msgData, IceNet: any) => {
      let user = await getUserInfo(data, IceNet);
      let nick_name = await IceNet.getContact(data.sender)
      let cb = {
        msg: `@${nick_name} 当前拥有${user.point}鱼皮\n连续签到${user.signin_times}天`,
        receiver: data.roomid ? data.roomid : data.sender,
        aters: data.sender
      }
      return cb;
    }
  }, {
    rule: /^查询群排名$/,
    func: async (data: msgData, IceNet: any) => {
      let nick_name = await IceNet.getContact(data.sender)
      let rank = await IceNet.user.find({
        order: {
          point: "DESC",
          signin_times: "ASC"
        },
        skip: 0,
        take: 10
      })
      let msg = `@${nick_name} 鱼排前10榜`
      for (let i = 0; i < rank.length; i++) {
        let u = rank[i];
        u.nick_name = await IceNet.getContact(u.wxid);
        msg += `\n ${i + 1}. ${u.nick_name} 拥有${u.point}鱼皮`
      }
      let cb = {
        msg: msg,
        receiver: data.roomid ? data.roomid : data.sender,
        aters: data.sender
      }
      return cb;
    }
  },
]

function rand(m: number, n: number) {
  return Math.ceil(Math.random() * (n - m + 1) + m - 1)
}

async function getUserInfo(data: msgData, IceNet: any) {
  let user: User = await IceNet.user.findOne({ where: { wxid: data.sender } })
  if (!(user && user.id)) {
    user = new User();
    user.wxid = data.sender;
    await IceNet.user.save(user);
    return getUserInfo(data, IceNet)
  }
  return user
}