import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { BloggerModule } from './blogger/blogger.module'
import { User } from './user/entities/user.entity'
import { Blogger } from './blogger/blogger.entity'
import { SuggestionModule } from './suggestion/suggestion.module'
import { Suggestion } from './suggestion/suggestion.entity'
import * as fs from 'fs'
import * as path from 'path'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const caPath = path.join(process.cwd(), 'ca.pem')
        const ca = fs.readFileSync(caPath).toString()

        return {
          type: 'postgres',
          url: configService.get('DATABASE_URL'),
          entities: [User, Blogger, Suggestion],
          synchronize: false,
          dropSchema: false,
          ssl: {
            rejectUnauthorized: true,
            ca: ca,
          },
        }
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    BloggerModule,
    SuggestionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
