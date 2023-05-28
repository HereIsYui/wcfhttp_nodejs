import { readFileSync, writeFile, accessSync, constants } from 'fs';
const confPath = ['config_dev.json', 'config.json'];
let confFinalPath: string;
for (const key in confPath) {
  try {
    accessSync(confPath[key], constants.R_OK | constants.W_OK);
    confFinalPath = confPath[key];
    break;
  } catch {}
}
export const configInfo = JSON.parse(readFileSync(confFinalPath, 'utf8'));

export const writeConfig = function (newInfo: any, callback: any) {
  writeFile(
    confFinalPath,
    JSON.stringify(newInfo, null, 4),
    'utf8',
    (err) => typeof callback === 'function' && callback(err),
  );
};
