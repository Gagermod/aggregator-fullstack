import { DataSource, DataSourceOptions } from 'typeorm'
import { config } from 'dotenv'
import { User } from './src/user/entities/user.entity'
import { Blogger } from './src/blogger/blogger.entity'
import { Suggestion } from './src/suggestion/suggestion.entity'

config()

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // This is important
  dropSchema: false,
  entities: [User, Blogger, Suggestion],
  migrations: ['dist/migrations/*.js'],
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource
