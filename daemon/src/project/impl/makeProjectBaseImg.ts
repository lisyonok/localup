import { ProjectConfig } from "src/_types"
import { createDockerController } from "src/docker"
import { createExecutor } from "src/docker/helpers/easyExec"
import { SseEmiter, createStdSseEventEmiter } from "./stdPipeSSE"

function createErrorHandler(name: string, sseEmiter: SseEmiter) {
  return (prefix: string) => (error: unknown) => {
    //@ts-expect-error >???
    const data = error?.json?.message ?? error

    const message = `[${name}]: Failed while ${prefix}: ${data}`
    console.error(message)
    sseEmiter(message)

    throw data
  }
}

export default async function makeProjectBaseImg(config: ProjectConfig) {
  const docker = createDockerController()

  const randomId = crypto.randomUUID()
  const randomNamePrefix = randomId.slice(0, 8)

  const sseEmiter = createStdSseEventEmiter(randomId)

  const baseContainerName = `${randomNamePrefix}_${config.project}_base`
  const handleError = createErrorHandler(baseContainerName, sseEmiter)

  sseEmiter(`Pulling base image ${config.baseImg}...`)
  await docker.pull(config.baseImg).catch(handleError("pulling"))

  sseEmiter(`Creating base container ${baseContainerName}...`)
  const container = await docker
    .createContainer({
      Image: config.baseImg,
      Cmd: ["/bin/bash"],
      name: baseContainerName,
      Entrypoint: ["tail", "-f", "/dev/null"]
    })
    .catch(handleError("creating container"))

  try {
    await container.start()
    sseEmiter(`Starting base container ${baseContainerName}...`)

    const exec = createExecutor(container, baseContainerName, sseEmiter)

    await exec(["mkdir", "/app"], { WorkingDir: "/" })
    await exec(["git", "clone", "git@github.com:apocas/dockerode.git", "."], { WorkingDir: "/app" })
    await exec(["ls", "-al"], { WorkingDir: "/app" })

    sseEmiter(`Done executing commands`)
    // sseEmiter(`Exporting base image...`)

    sseEmiter(`Stoping container...`)
    await container.stop()

    sseEmiter(`Succesfully created base image`, "ready")
  } catch {
    sseEmiter(`Something went wrong. Read logs for investigation`, "failed")
  } finally {
    await container.remove({ force: true })
  }
}
