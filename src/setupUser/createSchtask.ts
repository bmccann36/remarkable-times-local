import * as path from 'path';
import * as sudo from 'sudo-prompt';

const indexFilePath = path.join(__dirname, '..', 'index.js');
const nodeExecutablePath = process.execPath;

// when running this in command prompt windows expect double \\
const normalizedIndexFilePath = indexFilePath.split('\\').join('\\\\');
const normalizedNodeExecPath = nodeExecutablePath.split('\\').join('\\\\');

// resolves to something like C:\\Program Files\\nodejs\\node.exe C:\\Users\\mccannb\\git-repos\\remarkable-times-local\\src\\index.js run
const rmtRunCmd = normalizedNodeExecPath + ' ' + normalizedIndexFilePath + ' run';
const schedTaskCreateCmd = getTaskCreateCommands(rmtRunCmd);

const createSchedTasks = function (): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('will create scheduled tasks to deliver newsletters as admin');
    sudo.exec(schedTaskCreateCmd, { name: 'Remarkable Times' }, function (error, stdout, stderr) {
      if (error) {
        console.error(stderr);
        reject(error);
      }
      resolve();
    });
  });
};

// makes it easy to run this file as a script if needed
if (process.argv[2] == 'exec') {
  console.log('re-creating scheduled tasks');
  createSchedTasks();
}

function getTaskCreateCommands(rmtRunCmd: string) {
  return `schtasks.exe /Delete /tn "rm-times01" /f
  schtasks.exe /Delete /tn "rm-times02" /f
  schtasks.exe /Delete /tn "rm-times03" /f
  schtasks.exe /Delete /tn "rm-times04" /f
  schtasks.exe /Delete /tn "rm-times05" /f
  schtasks /create /tn "rm-times01" /ru SYSTEM /tr "${rmtRunCmd}" /sc daily /st 06:00
  schtasks /create /tn "rm-times02" /ru SYSTEM /tr "${rmtRunCmd}" /sc daily /st 06:30
  schtasks /create /tn "rm-times03" /ru SYSTEM /tr "${rmtRunCmd}" /sc daily /st 07:00
  schtasks /create /tn "rm-times04" /ru SYSTEM /tr "${rmtRunCmd}" /sc daily /st 18:00
  schtasks /create /tn "rm-times05" /ru SYSTEM /tr "${rmtRunCmd}" /sc daily /st 18:30`;
}

export default createSchedTasks;
