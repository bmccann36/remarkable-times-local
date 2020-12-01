import * as fs from "fs";
import * as plist from "plist";
import * as os from "os";
import * as shelljs from "shelljs";

//? WRITE PLIST
/**
 * this script customizes a daemon.plist file which defines a daemon service to run at intervals on Mac OS
 * background on how this works here https://medium.com/better-programming/schedule-node-js-scripts-on-your-mac-with-launchd-a7fca82fbf02
 */

const createPlist = (): void => {
  const nodeExecutablePath = process.execPath;

  const plistData = {
    Label: "com.rt-local.daemon.plist",
    // RunAtLoad: true,
    StandardErrorPath: process.cwd() + "/stderr.log",
    StandardOutPath: process.cwd() + "/stdout.log",
    StartCalendarInterval: getCalendarInterval(),
    EnvironmentVariables: {
      PATH:
        "<![CDATA[/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin]]>",
    },
    WorkingDirectory: process.cwd(),
    ProgramArguments: [
      nodeExecutablePath,
      "lib/src/fetchNlContent/orchestrator.js",
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
};

export default createPlist;

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
      Hour: 7,
      Minute: 30,
    },
  ];
}
