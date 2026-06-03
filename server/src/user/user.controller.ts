import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { SyncFavoritesDto } from './dto/sync-favorites.dto'

interface RequestWithUser extends Request {
  user: {
    id: string
    login: string
  }
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @UseGuards(JwtAuthGuard)
  @Post('favorites/sync')
  async syncFavorites(
    @Request() req: RequestWithUser,
    @Body() syncFavoritesDto: SyncFavoritesDto
  ) {
    const user = await this.userService.syncFavorites(
      req.user.id,
      syncFavoritesDto.bloggerIds
    )
    return {
      favoriteBloggerIds: user.favoriteBloggers.map((b) => b.id),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('favorites/:bloggerId')
  async toggleFavorite(
    @Request() req: RequestWithUser,
    @Param('bloggerId') bloggerId: string
  ) {
    const user = await this.userService.toggleFavorite(req.user.id, bloggerId)
    return {
      favoriteBloggerIds: user.favoriteBloggers.map((b) => b.id),
    }
  }
}
