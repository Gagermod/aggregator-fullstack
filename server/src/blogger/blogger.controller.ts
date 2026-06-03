
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { BloggerService } from './blogger.service'
import { AdminGuard } from '../auth/guards/admin.guard'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ContentLinkDto } from './dto/content-management.dto'

@Controller('blogger')
export class BloggerController {
  constructor(private readonly bloggerService: BloggerService) {}

  @Get()
  findAll() {
    return this.bloggerService.findAll()
  }

  @Get('content-types')
  getContentTypes() {
    return this.bloggerService.getContentTypes()
  }

  @Get('names')
  getAllBloggerNames() {
    return this.bloggerService.getAllBloggerNames()
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/view')
  incrementView(@Param('id') id: string, @Req() req) {
    return this.bloggerService.incrementView(id, req.user.id)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(':id/content')
  addContent(
    @Param('id') bloggerId: string,
    @Body() dto: ContentLinkDto,
  ) {
    return this.bloggerService.addContent(bloggerId, dto)
  }


  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id/content')
  removeContent(
    @Param('id') bloggerId: string,
    @Body() dto: { url: string; type: string }
  ) {
    return this.bloggerService.removeContent(bloggerId, dto.url, dto.type)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bloggerService.remove(id)
  }
}
