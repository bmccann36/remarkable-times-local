import { ILogObject, IStd, Logger } from "tslog";
import { appendFileSync } from "fs";
import * as path from "path";

/**
 * simple utility class for tslog to set internal buffer object
 * stole this from the docs https://tslog.js.org/#/?id=printprettylog
 */
class SimpleStd implements IStd {
  constructor(private _buffer: string = "") {}
  write(message: string) {
    this._buffer += message;
  }
  get buffer(): string {
    return this._buffer;
  }
}

const log: Logger = new Logger();
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
  "debug"
);

/**
 * every day write logs to a new file to keep em separate
 */
const dateString = new Date().toISOString().split("T")[0];
const logDir = path.join(__dirname, "..", "logs");
const todayLogFileName = logDir + `/${dateString}.log`;

function logToTransport(logObject: ILogObject) {
  const myStd = new SimpleStd();
  // add text to simple interface
  log.printPrettyLog(myStd, logObject);
  appendFileSync(todayLogFileName, myStd.buffer);
}

export default log;
