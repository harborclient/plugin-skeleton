// ../harborclient-sdk/dist/runtime-utils.js
var LOG_LEVEL_RANK = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4
};
function createLogger(pluginId, options) {
  const prefix = `[${pluginId}]`;
  let level = options?.level ?? "info";
  function log(messageLevel, write, ...args) {
    if (LOG_LEVEL_RANK[messageLevel] < LOG_LEVEL_RANK[level]) {
      return;
    }
    write(prefix, ...args);
  }
  const consoleLog = (...values) => {
    console.log(...values);
  };
  return {
    debug(...args) {
      log("debug", consoleLog, ...args);
    },
    info(...args) {
      log("info", consoleLog, ...args);
    },
    warn(...args) {
      const write = typeof console.warn === "function" ? (...values) => {
        console.warn(...values);
      } : consoleLog;
      log("warn", write, ...args);
    },
    error(...args) {
      const write = typeof console.error === "function" ? (...values) => {
        console.error(...values);
      } : consoleLog;
      log("error", write, ...args);
    },
    setLevel(nextLevel) {
      level = nextLevel;
    }
  };
}

// src/main.ts
var logger = createLogger("skeleton");
function activate(hc) {
  hc.subscriptions.push(
    hc.http.onAfterSend(
      (request, response) => {
        logger.info(`${response.status} ${request.method} ${request.url}`);
      }
    )
  );
}
export {
  activate
};
