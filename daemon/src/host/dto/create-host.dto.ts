import { ProjectConfig } from "src/_types"

export type CreateHostDto = {
  tag: string
  auth?: {
    user: string
    pass: string
  }
  config: Partial<ProjectConfig> & {
    path?: string
  }
}
