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

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: false,
        dropSchema: false,
        entities: [User, Blogger, Suggestion],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    BloggerModule,
    SuggestionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
