import Colors = require('colors.ts');
import * as dayjs from 'dayjs'
Colors.enable();

export const LOGGER = {
  Log: function (log: string): void {
    log = LogAddTag(log);
    console.log(log)
  },
  Err: function (log: string): void {
    log = LogAddTag(log);
    console.log(log.error)
  },
  Warn: function (log: string): void {
    log = LogAddTag(log);
    console.log(log.warning)
  },
  Succ: function (log: string): void {
    log = LogAddTag(log);
    console.log(log.green)
  }
}

function LogAddTag(log: string) {
  let now = dayjs().format('YYYY-MM-DD HH:mm:ss');
  return `[IceNet] ${now} ${log}`
}