export type TemplateError = {
  message: string
  code: "FORBIDDEN" | "INTERNAL_FATAL"
  status: number
}

export type ProjectConfig = {
  baseImg: string
  repo: string
  project: string
  hostname?: string
  keepAliveHostDays?: number
}
