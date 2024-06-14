import { Observable, Subject, filter } from "rxjs"

export type StdMessage = { id: string; stdStr: string; timeStamp: Date }
export type StdMessageEvent = MessageEvent<StdMessage>
export type StdMessageObservable = Observable<StdMessageEvent>

export type SseEmiter = (stdStr: string, type?: "std" | "ready" | "failed") => void

const stdPipe = new Subject<StdMessageEvent>()

export function createStdSseEventEmiter(id: string) {
  console.log(`Sse with std output: /v1/api/project/sse/${id}`)
  const sseEmiter: SseEmiter = (stdStr, type = "std") =>
    stdPipe.next(new MessageEvent(type, { data: { id, stdStr, timeStamp: new Date() } }))

  return sseEmiter
}

export function getStdPipeForId(id: string) {
  if (id === "shhhhh") return stdPipe.asObservable()
  return stdPipe.asObservable().pipe(filter((mes) => mes.data.id === id))
}

export { stdPipe }
