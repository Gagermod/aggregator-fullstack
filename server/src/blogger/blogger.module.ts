
import { Module, Global, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Blogger } from './blogger.entity'
import { BloggerService } from './blogger.service'
import { BloggerController } from './blogger.controller'
import { UserModule } from '../user/user.module'
import { AdminGuard } from '../auth/guards/admin.guard'
import { User } from '../user/user.entity'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Blogger, User]),
    forwardRef(() => UserModule),
  ],
  controllers: [BloggerController],
  providers: [BloggerService, AdminGuard],
  exports: [BloggerService],
})
export class BloggerModule {}

