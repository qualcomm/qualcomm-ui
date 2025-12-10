import {useEffect, useId, useState} from "react"

export interface ServerObject {
  description?: string
  url: string
  variables?: Record<string, ServerVariableObject>
}

export interface ServerVariableObject {
  default: string
  description?: string
  enum?: string[]
}

export interface ServerSelectorProps {
  onServerChange?: (url: string) => void
  onVariableChange?: (key: string, value: string) => void
  selectedServer?: string
  servers: ServerObject[]
}

export function ServerSelector({
  onServerChange,
  onVariableChange,
  selectedServer,
  servers,
}: ServerSelectorProps) {
  const id = useId()
  const [currentServer, setCurrentServer] = useState(
    selectedServer || servers[0]?.url || "",
  )

  useEffect(() => {
    if (!selectedServer && servers[0]) {
      setCurrentServer(servers[0].url)
      onServerChange?.(servers[0].url)
    }
  }, [servers, selectedServer, onServerChange])

  const server = servers.find((s) => s.url === currentServer)

  const handleServerChange = (url: string) => {
    setCurrentServer(url)
    onServerChange?.(url)
  }

  if (servers.length === 0) {
    return null
  }

  return (
    <div className="openapi-server-selector">
      <label
        htmlFor={`${id}-select`}
        className="openapi-server-selector__label"
      >
        Server
      </label>

      <div className="openapi-server-selector__container">
        {servers.length === 1 ? (
          <div className="openapi-server-selector__single">
            {servers[0].url}
          </div>
        ) : (
          <select
            id={`${id}-select`}
            className="openapi-server-selector__select"
            value={currentServer}
            onChange={(e) => handleServerChange(e.target.value)}
          >
            {servers.map((s) => (
              <option key={s.url} value={s.url}>
                {s.url}
              </option>
            ))}
          </select>
        )}
      </div>

      {server?.variables && Object.keys(server.variables).length > 0 && (
        <div className="openapi-server-selector__variables">
          {Object.entries(server.variables).map(([key, variable]) => (
            <div key={key} className="openapi-server-selector__variable">
              <label
                htmlFor={`${id}-${key}`}
                className="openapi-server-selector__variable-label"
              >
                {key}
              </label>
              {variable.enum ? (
                <select
                  id={`${id}-${key}`}
                  className="openapi-server-selector__variable-select"
                  defaultValue={variable.default}
                  onChange={(e) => onVariableChange?.(key, e.target.value)}
                >
                  {variable.enum.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`${id}-${key}`}
                  className="openapi-server-selector__variable-input"
                  type="text"
                  defaultValue={variable.default}
                  onChange={(e) => onVariableChange?.(key, e.target.value)}
                />
              )}
              {variable.description && (
                <span className="openapi-server-selector__variable-description">
                  {variable.description}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {server?.description && (
        <div className="openapi-server-selector__description">
          {server.description}
        </div>
      )}
    </div>
  )
}
