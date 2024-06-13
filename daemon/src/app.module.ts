import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common"
import { AuthMiddleware } from "./auth.middleware"
import { HostModule } from "./host/host.module"
import { ProjectModule } from "./project/project.module"
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: [".env.local", ".env"] }), HostModule, ProjectModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL })
  }
}
