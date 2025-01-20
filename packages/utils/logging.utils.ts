// Declare BUILD_ENV for TypeScript
declare const BUILD_ENV: string | undefined;

/**
 * Environment detection that works in both Node.js and browser environments
 * without relying on process.env
 */
const isDevelopment = () => {
  try {
    // Check if we're in a production build
    if (typeof BUILD_ENV !== "undefined") {
      return BUILD_ENV === "development" || BUILD_ENV === "debug";
    }

    // For local development in browser
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      return (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.startsWith("192.168.") ||
        hostname.endsWith(".local")
      );
    }

    // For test environments (checking global objects that exist in test runners)
    if (typeof globalThis !== "undefined") {
      return Object.keys(globalThis).some(
        (key) =>
          key.toLowerCase().includes("test") ||
          key.toLowerCase().includes("jest") ||
          key.toLowerCase().includes("vitest")
      );
    }

    // Default to production for safety
    return false;
  } catch {
    // If anything fails, default to production for safety
    return false;
  }
};

export type LogLevel = "info" | "warn" | "error" | "debug";
const logLevels = ["debug", "info", "warn", "error"] as const;
export const showLevelsAbove: LogLevel = isDevelopment() ? "debug" : "warn";

const loggerFunctions = {
  debug: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

/**
 * Creates a logger with namespace that respects the current environment
 * @param namespace - The namespace for the logger (usually component or module name)
 * @returns A function that takes a log level and arguments to log
 */
export const createLogger = (namespace: string) => {
  const showLevels = logLevels.slice(logLevels.indexOf(showLevelsAbove));
  return (level: LogLevel, ...args: unknown[]) => {
    if (showLevels.includes(level)) {
      loggerFunctions[level](`[${namespace}]`, ...args);
    }
  };
};
