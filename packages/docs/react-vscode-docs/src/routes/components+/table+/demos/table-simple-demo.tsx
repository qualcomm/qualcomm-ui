import type {ReactNode} from "react"

import {Table, Tbody, Td, Th, Thead, Tr} from "@qualcomm-ui/react-vscode/table"

export function TableSimpleDemo(): ReactNode {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th align="left">Asset Name</Th>
          <Th align="left">Asset Type</Th>
          <Th align="left">Target OS</Th>
          <Th align="left">Agreement Type</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>Qualcomm Telematics SDK</Td>
          <Td>Software Tool</Td>
          <Td>Any</Td>
          <Td>Public</Td>
        </Tr>
        <Tr>
          <Td>TPS Location SDK v5.15.3 for Android</Td>
          <Td>Software Package</Td>
          <Td>Any</Td>
          <Td>Public</Td>
        </Tr>
        <Tr>
          <Td>QCS6490 Linux</Td>
          <Td>Software Tool Product</Td>
          <Td>Any</Td>
          <Td>Public</Td>
        </Tr>
      </Tbody>
    </Table>
  )
}
