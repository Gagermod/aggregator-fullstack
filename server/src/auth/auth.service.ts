import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { User } from '../user/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(login: string, password: string): Promise<User | null> {
    const user = await this.userService.findOne(login)

    if (user) {
      const passwordIsMatch = await argon2.verify(user.password, password)
      if (passwordIsMatch) {
        return user
      }
    }
    return null
  }

  async login(user: User) {
    const payload = { id: user.id, login: user.login }
    return {
      id: user.id,
      login: user.login,
      role: user.role,
      viewedBloggerIds: user.viewedBloggerIds,
      favoriteBloggers: user.favoriteBloggers,
      token: this.jwtService.sign(payload),
    }
  }
}
