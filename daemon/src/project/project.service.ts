import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { CreateProjectDto } from "./dto/create-project.dto"
import { UpdateProjectDto } from "./dto/update-project.dto"
import { TemplateError } from "src/_types"
import makeProjectBaseImg from "./impl/makeProjectBaseImg"
import { getStdPipeForId } from "./impl/stdPipeSSE"

@Injectable()
export class ProjectService {
  stdPipeForId(uid: string) {
    return getStdPipeForId(uid)
  }

  async create(createProjectDto: CreateProjectDto) {
    try {
      await makeProjectBaseImg(createProjectDto)
      return { ok: true }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException({
        code: "INTERNAL_FATAL",
        message: "Failed to create base container. See #log for details",
        status: 500
      } as TemplateError)
    }
  }

  findAll() {
    return `This action returns all project`
  }

  findOne(id: number) {
    return `This action returns a #${id} project`
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`
  }

  remove(id: number) {
    return `This action removes a #${id} project`
  }
}
