import * as fs from "fs";
import * as plist from "plist";
import * as path from "path";

// const obj = plist.parse(
//   fs.readFileSync(path.join(__dirname, "..", "plistTemplate.plist"), "utf8")
// );
// console.log(JSON.stringify(obj));

//? WRITE PLIST

const plistData = {
  Label: "com.demo.daemon.plist",
  RunAtLoad: true,
  StartInterval: 60,
  StandardErrorPath: "/Users/chylomicronman/git-repos/rt-prompt/stderr.log",
  StandardOutPath: "/Users/chylomicronman/git-repos/rt-prompt/stdout.log",
  EnvironmentVariables: {
    PATH:
      "<![CDATA[/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin]]>",
  },
  WorkingDirectory: "/Users/chylomicronman/git-repos/rt-prompt",
  ProgramArguments: [
    "/Users/chylomicronman/.nvm/versions/node/v12.19.0/bin/node",
    "schedule-demo.js",
  ],
};

// const jsonFile = fs.readFileSync(
//   path.join(__dirname, "..", "plistDef.json"),
//   "utf8"
// );

// const json = JSON.parse(jsonFile.toString());

const builtPlist = plist.build(plistData);
fs.writeFileSync("generatedPlist.plist", builtPlist);
