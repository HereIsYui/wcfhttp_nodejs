export interface cbData {
  code: number;
  message: string;
}

export interface msgData {
  id: string;
  type: number;
  xml: string;
  sender: string;
  roomid: string;
  content: string;
  thumb: string;
  extra: string;
  is_at: boolean;
  is_self: boolean;
  is_group: boolean;
}

export interface contactsData {
  wxid: string;
  NickName: string;
}

/**
 * @param msg 要发送的消息
 * @param receiver 收消息的人
 * @param aters 要艾特的人列表，多个用','隔开
 */
export interface sendMsgData {
  msg: string;
  receiver: string;
  aters: string;
}
