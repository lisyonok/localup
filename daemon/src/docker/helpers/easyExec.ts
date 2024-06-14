import Dockerode from "dockerode"
import { SseEmiter } from "src/project/impl/stdPipeSSE"
import { PassThrough } from "stream"
import { createDockerController } from ".."

const docker = createDockerController()

async function executionHandler(stream: NodeJS.ReadWriteStream, sseEmiter: SseEmiter) {
  return await new Promise<void>((resolve, reject) => {
    const stderr = new PassThrough()
    const stdout = new PassThrough()

    let hasErrChunks = false

    docker.modem.demuxStream(stream, stdout, stderr)
    stderr.on("data", () => (hasErrChunks = true))

    stream.on("data", (chunk: Buffer) => sseEmiter(chunk.toString()))
    stream.on("end", () => (hasErrChunks ? reject() : resolve()))
  })
}

export function createExecutor(container: Dockerode.Container, name: string, sseEmiter: SseEmiter) {
  return async function exec(Cmd: string[], opt?: Dockerode.ExecCreateOptions) {
    sseEmiter(`Executing "${Cmd.join(" ")}"...`)

    try {
      const executor = await container.exec({ Cmd, ...opt, AttachStdout: true, AttachStderr: true, Tty: false })
     await executor.start({ hijack: true }).then((stream) => executionHandler(stream, sseEmiter))

    } catch (error) {
      console.error(`[${name}]: ${error}`)
      throw `[${name}]: ${error}`
    }
  }
}
