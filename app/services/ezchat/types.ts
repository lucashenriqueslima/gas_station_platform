export type EzChatJsonValue =
  | string
  | number
  | boolean
  | null
  | EzChatJsonValue[]
  | { [key: string]: EzChatJsonValue }

export type EzChatPayload = Record<string, EzChatJsonValue>

export type EzChatRunParams<TPayload extends EzChatPayload = EzChatPayload> = {
  runId: string
  sender: string
  payload: TPayload
}

export type EzChatIndicationPayload = {
  indicado: string
  associado: string
  numero_phone: string
}
