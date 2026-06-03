import { Blogger } from '../blogger/blogger.entity'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  login: string

  @Column()
  password?: string

  @Column({ default: 'user' })
  role: string

  @ManyToMany(() => Blogger, (blogger) => blogger.favoritedBy, {
    cascade: true,
  })
  @JoinTable()
  favoriteBloggers: Blogger[]

  @Column({ type: 'text', array: true, default: [] })
  viewedBloggerIds: string[]
}
