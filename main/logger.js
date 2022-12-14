const {writeFile, mkdir} = require('fs/promises');
const {inspect} = require('util');
const config = require('./config');

module.exports = class Logger {
  /**
   * @author SoulHarsh007 <harsh.peshwani@outlook.com>
   * @copyright SoulHarsh007 2021
   * @since v1.0.0-rc-02
   * @param {string} [defaultMeta] - Default meta field for logs
   * @param {string} [logsPath] - force specified path for logging
   * @class Logger
   * @classdesc prettifies, stores and then logs any data to console
   */
  constructor(defaultMeta, logsPath) {
    /**
     * @type {string[]}
     */
    this.logs = [];
    this.meta = defaultMeta;
    this.logsPath = logsPath;
  }

  /**
   * @function generateLogFile
   * @since v1.0.0-rc-02
   * @description generates log file and stores it to logsPath/RebornOS Fire <CURRENT TS>.log
   * @param {string} [logName] - name of the log file to use
   * @returns {Promise<string | Error>} Path to log file
   */
  generateLogFile(logName) {
    const logID = `RebornOS Fire ${
      logName ??
      new Date()
        .toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        })
        .replace(/,/g, '')
    }`.replace(/ /g, '_');
    const fileName = `${this.logsPath ?? config.get('logs.path')}/${logID}.log`;
    return mkdir(this.logsPath ?? config.get('logs.path'), {recursive: true})
      .then(() => writeFile(fileName, this.rawLogs))
      .then(() => fileName)
      .catch(e => e.stack ?? e);
  }

  /**
   * @function log
   * @since v1.0.0-rc-02
   * @param {string} [data] - log format param [date time `${meta}`] [`${type}`] - `${data}`
   * @param {string} [type] - log format param [date time `${meta}`] [`${type}`] - `${data}`
   * @param {any} [meta] - log format param [date time `${meta}`] [`${type}`] - `${data}`
   * @param {boolean} [silent] - if true, logger stores the log without logging to console
   * @description stores and logs data to console
   */
  log(data, type, meta, silent = false) {
    if (typeof data !== 'string') {
      data = inspect(data);
    }
    const log = `[${new Date()
      .toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      })
      .replace(/,/g, '')} ${meta ?? this.meta}] [${type}] - ${data}`;
    this.logs.push(log);
    if (!silent) {
      console.log(log);
    }
  }

  /**
   * @function rawLogs
   * @since v1.0.0-rc-02
   * @returns {string} Raw logs
   * @description raw logs with RebornOS Fire header and footer appended
   */
  get rawLogs() {
    if (
      this.logs[0] !==
      `========== RebornOS Fire v${process.env.VERSION} (${process.env.CODE_NAME}) Log File ==========\n`
    ) {
      this.logs.unshift(
        `========== RebornOS Fire v${process.env.VERSION} (${process.env.CODE_NAME}) Log File ==========\n`
      );
      this.logs.push(
        `\n========== RebornOS Fire v${process.env.VERSION} (${process.env.CODE_NAME}) Log File ==========\n`
      );
    }
    return this.logs.join('\n');
  }

  /**
   * @function clearLogs
   * @since v1.0.0-rc-02
   * @param {boolean} [callGC] - call gc
   * @description clears all stored logs and optionally calls gc
   */
  clearLogs(callGC) {
    delete this.logs;
    this.logs = [];
    if (callGC) {
      global?.gc();
    }
  }
};
