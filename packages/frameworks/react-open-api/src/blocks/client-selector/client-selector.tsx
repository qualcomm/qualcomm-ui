import {useId, useState} from "react"

export interface ClientOption {
  id: string
  language?: string
  title: string
}

export interface ClientOptionGroup {
  options: ClientOption[]
  title: string
}

export interface ClientSelectorProps {
  clientOptions: ClientOptionGroup[]
  installationDescription?: string
  installationSource?: string
  onClientChange?: (clientId: string) => void
  selectedClient?: string
}

const FEATURED_CLIENTS = [
  "curl",
  "javascript/fetch",
  "python/requests",
  "go/native",
]

export function ClientSelector({
  clientOptions,
  installationDescription,
  installationSource,
  onClientChange,
  selectedClient = "curl",
}: ClientSelectorProps) {
  const id = useId()
  const [currentClient, setCurrentClient] = useState(selectedClient)

  const flatOptions = clientOptions.flatMap((group) => group.options)
  const selectedOption = flatOptions.find((opt) => opt.id === currentClient)

  const featuredClients = flatOptions.filter((opt) =>
    FEATURED_CLIENTS.includes(opt.id),
  )

  const handleClientChange = (clientId: string) => {
    setCurrentClient(clientId)
    onClientChange?.(clientId)
  }

  if (clientOptions.length === 0) {
    return null
  }

  return (
    <div className="openapi-client-selector">
      <div id={id} className="openapi-client-selector__label">
        Client Libraries
      </div>

      <div
        className="openapi-client-selector__tabs"
        role="tablist"
        aria-labelledby={id}
      >
        {featuredClients.map((client) => (
          <button
            key={client.id}
            className="openapi-client-selector__tab"
            role="tab"
            type="button"
            aria-selected={currentClient === client.id}
            data-selected={currentClient === client.id || undefined}
            onClick={() => handleClientChange(client.id)}
          >
            {client.title}
          </button>
        ))}

        <select
          className="openapi-client-selector__more"
          value={FEATURED_CLIENTS.includes(currentClient) ? "" : currentClient}
          onChange={(e) => {
            if (e.target.value) {
              handleClientChange(e.target.value)
            }
          }}
          aria-label="More client libraries"
        >
          <option value="" disabled>
            More...
          </option>
          {clientOptions.map((group) => (
            <optgroup key={group.title} label={group.title}>
              {group.options
                .filter((opt) => !FEATURED_CLIENTS.includes(opt.id))
                .map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.title}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="openapi-client-selector__content" role="tabpanel">
        {installationDescription && (
          <div className="openapi-client-selector__description">
            {installationDescription}
          </div>
        )}

        {installationSource ? (
          <pre className="openapi-client-selector__code">
            <code>{installationSource}</code>
          </pre>
        ) : (
          <div className="openapi-client-selector__selected">
            {selectedOption?.title}
          </div>
        )}
      </div>
    </div>
  )
}
