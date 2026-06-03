import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Suggestion } from './suggestion.entity'
import { SuggestionService } from './suggestion.service'
import { SuggestionController } from './suggestion.controller'
import { BloggerModule } from '../blogger/blogger.module'
import { UserModule } from '../user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Suggestion]), BloggerModule, UserModule],
  providers: [SuggestionService],
  controllers: [SuggestionController],
})
export class SuggestionModule {}
