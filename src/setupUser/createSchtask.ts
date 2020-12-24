import * as path from 'path';
import * as sudo from 'sudo-prompt';
import log from '../logger';

const indexFilePath = path.join(__dirname, '..', 'index.js');
const nodeExecutablePath = process.execPath;
const rootModulePath = path.join(__dirname, '..', '..');

// when running this in command prompt windows expect double \\
const normalizedIndexFilePath = indexFilePath.split('\\').join('\\\\');
const normalizedNodeExecPath = nodeExecutablePath.split('\\').join('\\\\');

// resolves to something like C:\\Program Files\\nodejs\\node.exe C:\\Users\\mccannb\\git-repos\\remarkable-times-local\\src\\index.js
const rmtRunCmd = normalizedNodeExecPath + ' ' + normalizedIndexFilePath + ' run';

console.log('rmtRunCmd :>> ', rmtRunCmd);

const schedTaskCreateCmd = `schtasks /create /tn "rmt-scheduled" /ru SYSTEM /tr "${rmtRunCmd}" /sc minute /mo 1`;

const promptOptions = { name: 'Remarkable Times' };

log.info('executing command as admin: ', schedTaskCreateCmd);

sudo.exec(schedTaskCreateCmd, promptOptions, function (error, stdout, stderr) {
  if (error) throw error;
  log.info('sudo.exec stdout: ' + stdout);
});

// C:\\"Program Files"\\nodejs\\node.exe C:\\Users\\mccannb\\git-repos\\remarkable-times-local\\lib\\index.js run