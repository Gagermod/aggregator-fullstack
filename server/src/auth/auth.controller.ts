import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  NotFoundException,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { User } from '../user/entities/user.entity'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { UserService } from '../user/user.service'

interface RequestWithFullUser extends Request {
  user: User
}

interface RequestWithJwtPayload extends Request {
  user: {
    id: string
    login: string
  }
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: RequestWithFullUser) {
    return this.authService.login(req.user)
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: RequestWithJwtPayload) {
    const user = await this.userService.findOneById(req.user.id)

    if (!user) {
      throw new NotFoundException('User not found from token.')
    }

    const { password, ...result } = user
    return result
  }
}
