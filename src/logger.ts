import * as fs from 'fs';
import { appendFileSync } from 'fs';
import * as path from 'path';
import { ILogObject, IStd, Logger, TLogLevelName } from 'tslog';

/**
 * simple utility class for tslog to set internal buffer object
 * stole this from the docs https://tslog.js.org/#/?id=printprettylog
 */
class SimpleStd implements IStd {
  constructor(private _buffer: string = '') {}
  write(message: string) {
    this._buffer += message;
  }
  get buffer(): string {
    return this._buffer;
  }
}

// coerce string value into boolean
const shouldPipeLogs: boolean = process.env.LOG_OVERWRITE == 'true' ? true : false;
const shouldColorize: boolean = process.env.LOG_COLORIZE == 'true' ? true : false;
const logMinLevel = <TLogLevelName>process.env.LOG_MIN_LEVEL
  ? <TLogLevelName>process.env.LOG_MIN_LEVEL
  : 'info';

const log: Logger = new Logger(
  /* specify console overwrite so we capture console.log by 3rd party libs */ {
    overwriteConsole: process.env.LOG_OVERWRITE ? shouldPipeLogs : true,
    minLevel: logMinLevel,
    colorizePrettyLogs: process.env.LOG_COLORIZE ? shouldColorize : false, // good for log files
  }
);
if (process.env.LOG_ATTACH_TRANSPORT == 'true') {
  log.attachTransport(
    {
      silly: logToTransport,
      debug: logToTransport,
      trace: logToTransport,
      info: logToTransport,
      warn: logToTransport,
      error: logToTransport,
      fatal: logToTransport,
    },
    logMinLevel
  );
}

/**
 * every day write logs to a new file to keep em separate
 */
const dateString = new Date().toISOString().split('T')[0];
const logDir = path.join(__dirname, '..', 'logs');

if (!fs.existsSync(logDir)) {
  console.log('logfile directory does not exist creating at', logDir);
  fs.mkdirSync(logDir);
}

const todayLogFileName = path.join(logDir, `${dateString}.log`);

function logToTransport(logObject: ILogObject) {
  const myStd = new SimpleStd();
  // add text to simple interface
  log.printPrettyLog(myStd, logObject);
  appendFileSync(todayLogFileName, myStd.buffer);
}

export default log;
