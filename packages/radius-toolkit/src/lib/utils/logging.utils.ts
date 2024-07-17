export type LogLevel = "info" | "warn" | "error" | "debug";
const logLevels = ["debug", "info", "warn", "error"] as const;
export const showLevelsAbove: LogLevel =
  process.env.NODE_ENV === "development" ? "debug" : "warn";

const loggerFunctions = {
  debug: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

export const createLogger = (namespace: string) => {
  const showLevels = logLevels.slice(logLevels.indexOf(showLevelsAbove));
  return (level: LogLevel, ...args: any[]) => {
    if (showLevels.includes(level)) {
      loggerFunctions[level](`[${namespace}]`, ...args);
    }
  };
};
