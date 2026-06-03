import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  forwardRef,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Blogger } from './blogger.entity'
import { bloggersData } from './bloggers-data'
import { ContentLinkDto } from './dto/content-management.dto'
import { randomUUID } from 'crypto'
import { UserService } from '../user/user.service'
import { User } from '../user/entities/user.entity'

@Injectable()
export class BloggerService implements OnModuleInit {
  private readonly logger = new Logger(BloggerService.name)

  constructor(
    @InjectRepository(Blogger)
    private readonly bloggerRepository: Repository<Blogger>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  async onModuleInit() {
    const count = await this.bloggerRepository.count()
    if (count === 0) {
      this.logger.log('Database is empty. Seeding bloggers...')
      try {
        const entities = this.bloggerRepository.create(bloggersData)
        await this.bloggerRepository.save(entities)
        this.logger.log('Seeding complete.')
      } catch (error) {
        this.logger.error('Error during database seeding:', error)
      }
    } else {
      this.logger.log('Database is not empty. Skipping seed.')
    }
  }

  async incrementView(bloggerId: string, userId: string): Promise<void> {
    await this.bloggerRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const user = await transactionalEntityManager
          .createQueryBuilder(User, 'user')
          .setLock('pessimistic_write')
          .where('user.id = :userId', { userId })
          .getOne()

        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`)
        }

        if (user.viewedBloggerIds.includes(bloggerId)) {
          throw new ForbiddenException('Blogger already viewed')
        }

        const blogger = await transactionalEntityManager
          .createQueryBuilder(Blogger, 'blogger')
          .setLock('pessimistic_write')
          .where('blogger.id = :bloggerId', { bloggerId })
          .getOne()

        if (!blogger) {
          throw new NotFoundException(`Blogger with ID ${bloggerId} not found`)
        }

        blogger.views = (blogger.views || 0) + 1
        user.viewedBloggerIds.push(bloggerId)

        await transactionalEntityManager.save(blogger)
        await transactionalEntityManager.save(user)
      }
    )
  }

  async findAll(): Promise<Blogger[]> {
    return this.bloggerRepository
      .createQueryBuilder('blogger')
      .select([
        'blogger.id',
        'blogger.name',
        'blogger.link',
        'blogger.content',
        'blogger.views',
      ])
      .getMany()
  }

  async findOneById(id: string): Promise<Blogger> {
    const blogger = await this.bloggerRepository.findOne({ where: { id } })
    if (!blogger) {
      throw new NotFoundException(`Blogger with ID ${id} not found`)
    }
    return blogger
  }

  async findByIds(ids: string[]): Promise<Blogger[]> {
    if (ids.length === 0) {
      return []
    }
    return this.bloggerRepository.findBy({ id: In(ids) })
  }

  async findOrCreateByName(name: string): Promise<Blogger> {
    const normalizedName = name.trim()

    const blogger = await this.bloggerRepository
      .createQueryBuilder('blogger')
      .where('LOWER(blogger.name) = LOWER(:name)', { name: normalizedName })
      .getOne()

    if (blogger) {
      return blogger
    }

    this.logger.log(`Blogger "${normalizedName}" not found. Creating...`)

    const newBlogger = this.bloggerRepository.create({
      id: randomUUID(),
      name: normalizedName,
      link: '/bloggers/default.jpg',
      content: {},
    })

    await this.bloggerRepository.save(newBlogger)
    return newBlogger
  }

  async updateContent(
    id: string,
    content: Record<string, any>,
    link?: string
  ): Promise<Blogger> {
    const updatePayload: { content: Record<string, any>; link?: string } = {
      content,
    }
    if (link) {
      updatePayload.link = link
    }
    await this.bloggerRepository.update(id, updatePayload)
    return this.findOneById(id)
  }

  async getContentTypes(): Promise<string[]> {
    const bloggers = await this.bloggerRepository.find()
    const contentTypes = new Set<string>()
    bloggers.forEach((blogger) => {
      if (blogger.content) {
        Object.keys(blogger.content).forEach((type) => {
          contentTypes.add(type)
        })
      }
    })
    return Array.from(contentTypes)
  }

  async getAllBloggerNames(): Promise<string[]> {
    const bloggers = await this.bloggerRepository.find({ select: ['name'] })
    return bloggers.map((b) => b.name)
  }

  async addContent(
    bloggerId: string,
    dto: ContentLinkDto
  ): Promise<Blogger> {
    return this.bloggerRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const blogger = await transactionalEntityManager
          .createQueryBuilder(Blogger, 'blogger')
          .setLock('pessimistic_write')
          .where('blogger.id = :bloggerId', { bloggerId })
          .getOne()

        if (!blogger) {
          throw new NotFoundException(`Blogger with ID ${bloggerId} not found`)
        }

        const newContent = { ...blogger.content }
        const existingLinks = newContent[dto.type] || []
        newContent[dto.type] = [
          ...existingLinks,
          { title: dto.title, url: dto.url },
        ]

        blogger.content = newContent
        return transactionalEntityManager.save(blogger)
      }
    )
  }

  async removeContent(
    bloggerId: string,
    url: string,
    type: string
  ): Promise<Blogger> {
    return this.bloggerRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const blogger = await transactionalEntityManager
          .createQueryBuilder(Blogger, 'blogger')
          .setLock('pessimistic_write')
          .where('blogger.id = :bloggerId', { bloggerId })
          .getOne()

        if (!blogger) {
          throw new NotFoundException(`Blogger with ID ${bloggerId} not found`)
        }

        const newContent = { ...blogger.content }
        const links = newContent[type] || []

        const filteredLinks = links.filter((link) => link.url !== url)

        if (filteredLinks.length === links.length) {
          throw new NotFoundException(
            `Link with URL "${url}" not found in type "${type}"`
          )
        }

        newContent[type] = filteredLinks
        blogger.content = newContent
        return transactionalEntityManager.save(blogger)
      }
    )
  }

  async remove(id: string): Promise<{ message: string }> {
    const blogger = await this.findOneById(id)
    await this.bloggerRepository.remove(blogger)
    return { message: `Blogger "${blogger.name}" has been successfully deleted.` }
  }
}
