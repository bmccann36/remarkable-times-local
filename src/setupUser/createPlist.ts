import * as fs from "fs";
import * as plist from "plist";
import * as os from "os";
import * as shelljs from "shelljs";
import * as path from 'path';
//? WRITE PLIST
/**
 * this script customizes a daemon.plist file which defines a daemon service to run at intervals on Mac OS
 * background on how this works here https://medium.com/better-programming/schedule-node-js-scripts-on-your-mac-with-launchd-a7fca82fbf02
 */

// makes it easy to run this file as a script if needed
if (process.argv[2] == 'exec') {
  console.log("re-writing plist file");
  createPlist()
}
export default createPlist;

function createPlist(): void {
  const indexFilePath = path.join(__dirname, '..', 'index.js');
  const nodeExecutablePath = process.execPath;
  const rootModulePath = path.join(__dirname, '..', '..');

  const plistData = {
    Label: "com.rt-local.daemon.plist",
    // RunAtLoad: true,
    StandardErrorPath: rootModulePath + "/logs/stderr.log",
    StandardOutPath: rootModulePath + "/logs/stdout.log",
    StartCalendarInterval: getCalendarInterval(),
    EnvironmentVariables: {
      PATH:
        "<![CDATA[/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin]]>",
    },
    WorkingDirectory: process.cwd(),
    ProgramArguments: [
      nodeExecutablePath,
      "--no-deprecation",
      indexFilePath,
      "run"
    ],
  };

  const plistFilePath =
    os.homedir() + "/Library/LaunchAgents/com.rt-local.daemon.plist";

  // create the apple plist format file which defines a daemon process
  const builtPlist = plist.build(plistData);
  // write the file to the Library/LaunchAgents directory
  fs.writeFileSync(plistFilePath, builtPlist);

  // unload the service if already loade
  shelljs.exec(`launchctl unload ${plistFilePath}`, { silent: true });
  // load the latest service definition
  shelljs.exec(`launchctl load ${plistFilePath}`);
}



function getCalendarInterval() {
  return [
    {
      Hour: 6,
      Minute: 30,
    },
    {
      Hour: 7,
    },
    {
      Hour: 18,
      Minute: 5,
    },
    {
      Hour: 18,
      Minute: 10,
    },
  ];
}
