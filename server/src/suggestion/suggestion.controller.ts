import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import 'multer'
import { SuggestionService } from './suggestion.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateSuggestionDto } from './dto/create-suggestion.dto'
import { AdminGuard } from '../auth/guards/admin.guard'
import type { SuggestionStatus } from './suggestion.entity'
import { ApproveSuggestionDto } from './dto/approve-suggestion.dto'
import { extname } from 'path'

@Controller('suggestions')
export class SuggestionController {
  constructor(private readonly suggestionService: SuggestionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateSuggestionDto, @Request() req) {
    return this.suggestionService.create(dto, req.user)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  findAll(@Query('status') status: SuggestionStatus = 'pending') {
    return this.suggestionService.findAll(status)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/approve')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './client/public/bloggers',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          cb(null, `${randomName}${extname(file.originalname)}`)
        },
      }),
    })
  )
  approve(
    @Param('id') id: string,
    @Body() dto: ApproveSuggestionDto,
    @UploadedFile() photo: Express.Multer.File
  ) {
    return this.suggestionService.approve(id, dto, photo)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.suggestionService.reject(id)
  }
}
