export type WebviewMessage = {type: "ready"} | {name: string; type: "greet"}

export type ExtensionMessage =
  | {type: "host-ready"}
  | {text: string; type: "greeting"}

/**
 * Validate incoming messages before allowing them to trigger extension work.
 */
export function readWebviewMessage(value: unknown): WebviewMessage | undefined {
  if (!value || typeof value !== "object" || !("type" in value)) {
    return undefined
  }
  if (value.type === "ready") {
    return {type: "ready"}
  }
  if (
    value.type === "greet" &&
    "name" in value &&
    typeof value.name === "string" &&
    value.name.length <= 64 &&
    value.name.trim()
  ) {
    return {name: value.name.trim(), type: "greet"}
  }
  return undefined
}

/**
 * Resolve the sample's message protocol without exposing extension APIs to React.
 */
export function respondToWebviewMessage(
  value: unknown,
): ExtensionMessage | undefined {
  const message = readWebviewMessage(value)
  if (!message) {
    return undefined
  }
  return message.type === "ready"
    ? {type: "host-ready"}
    : {text: `Hello, ${message.name}!`, type: "greeting"}
}

export function isExtensionMessage(value: unknown): value is ExtensionMessage {
  if (!value || typeof value !== "object" || !("type" in value)) {
    return false
  }
  return (
    value.type === "host-ready" ||
    (value.type === "greeting" &&
      "text" in value &&
      typeof value.text === "string" &&
      value.text.length <= 200)
  )
}
