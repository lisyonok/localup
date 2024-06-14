import { Controller, Get, Post, Body, Patch, Param, Delete, Sse } from "@nestjs/common"
import { ProjectService } from "./project.service"
import { CreateProjectDto } from "./dto/create-project.dto"
import { UpdateProjectDto } from "./dto/update-project.dto"
import { StdMessageObservable } from "./impl/stdPipeSSE"

@Controller("project")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto)
  }

  @Sse("sse/:uid")
  sse(@Param("uid") uid: string): StdMessageObservable {
    return this.projectService.stdPipeForId(uid)
  }

  @Get()
  findAll() {
    return this.projectService.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.projectService.findOne(+id)
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto)
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.projectService.remove(+id)
  }
}
