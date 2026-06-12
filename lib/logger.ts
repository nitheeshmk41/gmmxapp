import { randomUUID } from "crypto";

type LogLevel = "info" | "warn" | "error";

type LogContext = Record<string, string | number | boolean | null | undefined>;

function redact(context: LogContext) {
  const blocked = new Set(["password", "secret", "token", "signature", "apiKey"]);
  return Object.fromEntries(
    Object.entries(context).filter(([key]) => !blocked.has(key))
  );
}

export function createCorrelationId() {
  return randomUUID();
}

export function logEvent(level: LogLevel, event: string, context: LogContext = {}) {
  const payload = {
    level,
    event,
    correlationId: context.correlationId ?? createCorrelationId(),
    ...redact(context),
  };

  if (level === "error") {
    console.error(JSON.stringify(payload));
    return;
  }

  if (level === "warn") {
    console.warn(JSON.stringify(payload));
    return;
  }

  console.log(JSON.stringify(payload));
}

