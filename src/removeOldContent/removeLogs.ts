import * as path from 'path';
import * as fs from 'fs';

const removeLogs = function (): void {
  const logDir = path.join(__dirname, '..', '..', 'logs');
  const logDirFiles = fs.readdirSync(logDir);

  const numLogDaysToKeep = Number(process.env.LOG_HISTORY_DAYS ? process.env.LOG_HISTORY_DAYS : 10);

  if (logDirFiles.length > numLogDaysToKeep) {
    // select the ten oldest log files
    const filesToRemove = logDirFiles.slice(0, logDirFiles.length - numLogDaysToKeep);
    console.log("removing files ", filesToRemove);
    filesToRemove.forEach((filename) => {
      fs.unlinkSync(logDir + '/' + filename);
    });
  }
};

export default removeLogs;
