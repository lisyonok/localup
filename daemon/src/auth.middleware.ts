import { Injectable, NestMiddleware } from "@nestjs/common"
import { Request, Response, NextFunction } from "express"
import { TemplateError } from "./_types"

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const key = process.env.API_KEY
    const reqKey = req.query.key

    if (key !== reqKey)
      return res.status(403).send({ message: "Invalid API key", code: "FORBIDDEN", status: 403 } as TemplateError)

    next()
  }
}
