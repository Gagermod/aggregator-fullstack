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
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production'

        if (isProduction) {
          // render configuration
          return {
            type: 'postgres',
            url: configService.get('DATABASE_URL'),
            entities: [User, Blogger, Suggestion],
            synchronize: false,
            dropSchema: false,
            ssl: { rejectUnauthorized: false },
          }
        } else {
          return {
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: parseInt(configService.get('DB_PORT')),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME'),
            entities: [User, Blogger, Suggestion],
            synchronize: false,
            dropSchema: false,
            ssl: false,
          }
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
