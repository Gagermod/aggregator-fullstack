import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import 'multer'
import { Suggestion, SuggestionStatus } from './suggestion.entity'
import { CreateSuggestionDto } from './dto/create-suggestion.dto'
import { User } from '../user/entities/user.entity'
import { BloggerService } from '../blogger/blogger.service'
import { ApproveSuggestionDto } from './dto/approve-suggestion.dto'
import { randomUUID } from 'crypto'
import { Blogger } from '../blogger/blogger.entity'

@Injectable()
export class SuggestionService {
  constructor(
    @InjectRepository(Suggestion)
    private readonly suggestionRepository: Repository<Suggestion>,
    private readonly bloggerService: BloggerService
  ) {}

  async create(dto: CreateSuggestionDto, user: User): Promise<Suggestion> {
    const suggestion = this.suggestionRepository.create({
      ...dto,
      submittedBy: user,
      status: 'pending',
    })
    return this.suggestionRepository.save(suggestion)
  }

  async findAll(status: SuggestionStatus): Promise<Suggestion[]> {
    return this.suggestionRepository.find({ where: { status } })
  }

  async findOne(id: string): Promise<Suggestion> {
    const suggestion = await this.suggestionRepository.findOne({
      where: { id },
    })
    if (!suggestion) {
      throw new NotFoundException(`Suggestion with ID ${id} not found`)
    }
    return suggestion
  }

  async approve(
    id: string,
    dto: ApproveSuggestionDto,
    photo?: Express.Multer.File
  ): Promise<Suggestion> {
    return this.suggestionRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const suggestion = await transactionalEntityManager.findOne(Suggestion, {
          where: { id },
        })
        if (!suggestion) {
          throw new NotFoundException(`Suggestion with ID ${id} not found`)
        }

        const normalizedName = suggestion.bloggerName.trim()
        let blogger = await transactionalEntityManager
          .createQueryBuilder(Blogger, 'blogger')
          .setLock('pessimistic_write')
          .where('LOWER(blogger.name) = LOWER(:name)', {
            name: normalizedName,
          })
          .getOne()

        if (!blogger) {
          blogger = transactionalEntityManager.create(Blogger, {
            id: randomUUID(),
            name: normalizedName,
            link: '/bloggers/default.jpg',
            content: {},
          })
        }

        if (photo) {
          blogger.link = `/bloggers/${photo.filename}`
        }

        if (dto.title && suggestion.links.length > 0) {
          suggestion.links[0].title = dto.title
        }

        const newContent = { ...blogger.content }
        const existingLinks = newContent[suggestion.contentType] || []
        newContent[suggestion.contentType] = [
          ...existingLinks,
          ...suggestion.links,
        ]
        blogger.content = newContent

        await transactionalEntityManager.save(Blogger, blogger)

        suggestion.status = 'approved'
        return transactionalEntityManager.save(Suggestion, suggestion)
      }
    )
  }

  async reject(id: string): Promise<Suggestion> {
    const suggestion = await this.findOne(id)
    suggestion.status = 'rejected'
    return this.suggestionRepository.save(suggestion)
  }
}
