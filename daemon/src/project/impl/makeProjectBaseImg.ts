import { ProjectConfig } from "src/_types"
import { createDockerController } from "src/docker"

export default async function makeProjectBaseImg(config: ProjectConfig) {
  const docker = createDockerController()

  const baseContainerName = `${config.project}-tempbase`
  const container = await docker.createContainer({ Image: config.baseImg, Cmd: ["/bin/bash"], name: baseContainerName })

  //   await container.start()

  //   await container.exec({ AttachStdout: true, WorkingDir: "/app", Cmd: ["bash", "-c", "uname -a"] })

  //   await container.stop()
}
