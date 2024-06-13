import * as Dockerode from "dockerode"

function createDockerController() {
  const socketPath = process.env.DOCKER_SOCKET
  console.log({ socketPath })

  return new Dockerode({ socketPath })
}

export { createDockerController }
