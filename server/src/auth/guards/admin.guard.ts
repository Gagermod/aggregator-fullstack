import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { UserService } from '../../user/user.service'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const userFromToken = request.user

    if (!userFromToken || !userFromToken.id) {
      return false
    }

    const userFromDb = await this.userService.findOneById(userFromToken.id)

    return !!(userFromDb && userFromDb.role === 'admin')
  }
}
