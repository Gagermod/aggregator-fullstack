import { Blogger } from '../../blogger/blogger.entity'
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

export type UserRole = 'admin' | 'user'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  login: string

  @Column({ select: false })
  password: string

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
    default: 'user',
  })
  role: UserRole

  @ManyToMany(() => Blogger, (blogger) => blogger.favoritedBy, {
    cascade: true,
  })
  @JoinTable({ name: 'user_favorite_bloggers' })
  favoriteBloggers: Blogger[]

  @Column({ type: 'text', array: true, default: [] })
  viewedBloggerIds: string[]

  @BeforeInsert()
  normalizeFields() {
    this.login = this.login.toLowerCase()
  }
}
