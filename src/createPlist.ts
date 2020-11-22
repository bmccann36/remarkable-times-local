import * as fs from "fs";
import * as plist from "plist";
import * as os from "os";
import * as shelljs from "shelljs";

//? WRITE PLIST

const nodeExecutablePath = process.execPath;

const plistData = {
  Label: "com.rt-local.daemon.plist",
  StandardErrorPath: process.cwd() + "/stderr.log",
  StandardOutPath: process.cwd() + "/stdout.log",
  StartCalendarInterval: [
    {
      Hour: 17, // run at this time
      Minute: 13,
    },
    {
      Hour: 17, // and run at this time
      Minute: 14,
    },
  ],
  EnvironmentVariables: {
    PATH:
      "<![CDATA[/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin]]>",
  },
  WorkingDirectory: process.cwd(),
  ProgramArguments: [nodeExecutablePath, "demoScript.js"], // TODO make this the real thing
};

const plistFilePath =
  os.homedir() + "/Library/LaunchAgents/com.rt-local.daemon.plist";

// create the apple plist format file which defines a daemon process
const builtPlist = plist.build(plistData);
// write the file to the Library/LaunchAgents directory
fs.writeFileSync(plistFilePath, builtPlist);

// unload the service if already loade
shelljs.exec(`launchctl unload ${plistFilePath}`);
// load the latest service definition
shelljs.exec(`launchctl load ${plistFilePath}`);
