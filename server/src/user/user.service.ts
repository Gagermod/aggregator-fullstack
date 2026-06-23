import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { In, Repository } from 'typeorm'
import * as argon2 from 'argon2'
import { BloggerService } from '../blogger/blogger.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly bloggerService: BloggerService
  ) {}

  async create(
    createUserDto: CreateUserDto
  ): Promise<Pick<User, 'id' | 'login'>> {
    const normalizedLogin = createUserDto.login.toLowerCase()

    const existUser = await this.userRepository.findOne({
      where: { login: normalizedLogin },
    })

    if (existUser) {
      throw new BadRequestException('Login already taken')
    }

    const userCount = await this.userRepository.count()
    const role = userCount === 0 ? 'admin' : 'user'

    const user = await this.userRepository.save({
      login: normalizedLogin,
      password: await argon2.hash(createUserDto.password),
      role: role,
    })

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async findOne(login: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.login',
        'user.password',
        'user.role',
        'user.viewedBloggerIds',
      ])
      .where('user.login = :login', { login: login.toLowerCase() })
      .leftJoinAndSelect('user.favoriteBloggers', 'favoriteBloggers')
      .getOne()
  }

  async findOneById(id: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.login', 'user.role', 'user.viewedBloggerIds'])
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.favoriteBloggers', 'favoriteBloggers')
      .getOne()
  }

  async toggleFavorite(userId: string, bloggerId: string): Promise<User> {
    return this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const user = await transactionalEntityManager
          .createQueryBuilder(User, 'user')
          // .setLock('pessimistic_write')
          .leftJoinAndSelect('user.favoriteBloggers', 'favoriteBloggers')
          .where('user.id = :userId', { userId })
          .getOne()

        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`)
        }

        const blogger = await this.bloggerService.findOneById(bloggerId)
        if (!blogger) {
          throw new NotFoundException(
            `Blogger with ID ${bloggerId} not found. Favorites can only be added for existing bloggers.`
          )
        }

        const isFavorite = user.favoriteBloggers.some(
          (b) => b.id === blogger.id
        )

        if (isFavorite) {
          user.favoriteBloggers = user.favoriteBloggers.filter(
            (b) => b.id !== blogger.id
          )
        } else {
          user.favoriteBloggers.push(blogger)
        }

        return transactionalEntityManager.save(user)
      }
    )
  }

  async syncFavorites(userId: string, bloggerIds: string[]): Promise<User> {
    return this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const user = await transactionalEntityManager.findOne(User, {
          where: { id: userId },
          relations: ['favoriteBloggers'],
        })

        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`)
        }

        await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from('user_favorite_bloggers')
          .where('"userId" = :userId', { userId })
          .execute()

        const bloggers = await this.bloggerService.findByIds(bloggerIds)
        if (bloggers.length !== bloggerIds.length) {
          throw new BadRequestException(
            'One or more bloggers from the sync list were not found in the database.'
          )
        }

        user.favoriteBloggers = bloggers

        return transactionalEntityManager.save(user)
      }
    )
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user)
  }
}
