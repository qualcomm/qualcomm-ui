import type {ReactElement} from "react"

import {Download, FileArchive, FileJson, FileText} from "lucide-react"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {Menu} from "@qualcomm-ui/react/menu"

export function MenuSplitButtonDemo(): ReactElement {
  return (
    <Menu.Root positioning={{placement: "bottom-end"}}>
      <Menu.SplitButton
        aria-label="Download"
        emphasis="primary"
        onClick={() => console.log("Download")}
        startIcon={Download}
        triggerProps={{"aria-label": "More download options"}}
      >
        Download
      </Menu.SplitButton>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="pdf">
              <Menu.ItemStartIcon icon={FileText} />
              Download as PDF
            </Menu.Item>
            <Menu.Item value="json">
              <Menu.ItemStartIcon icon={FileJson} />
              Download as JSON
            </Menu.Item>
            <Menu.Item value="zip">
              <Menu.ItemStartIcon icon={FileArchive} />
              Download as ZIP
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
