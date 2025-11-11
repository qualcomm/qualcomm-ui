// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type RefObject, useCallback, useEffect, useRef} from "react"

export function useBroadcastChannel<T = string>(
  channelName: string,
  handleMessage?: (event: MessageEvent) => void,
  handleMessageError?: (event: MessageEvent) => void,
): (data: T) => void {
  const channelRef = useRef(
    typeof window !== "undefined" && "BroadcastChannel" in window
      ? new BroadcastChannel(`${channelName}-channel`)
      : null,
  )

  useChannelEventListener(channelRef, "message", handleMessage)
  useChannelEventListener(channelRef, "messageerror", handleMessageError)

  return useCallback(
    (data: T) => {
      channelRef?.current?.postMessage(data)
    },
    [channelRef],
  )
}

function useChannelEventListener<K extends keyof BroadcastChannelEventMap>(
  channelRef: RefObject<BroadcastChannel | null>,
  event: K,
  handler: (e: BroadcastChannelEventMap[K]) => void = () => {},
) {
  useEffect(() => {
    const channel = channelRef.current
    if (channel) {
      channel.addEventListener(event, handler)
      return () => channel.removeEventListener(event, handler)
    }
    return undefined
  }, [channelRef, event, handler])
}
