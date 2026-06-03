import { User } from '../user/entities/user.entity'
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm'

@Entity()
export class Blogger {
  @PrimaryColumn('text')
  id: string

  @Column({ unique: true })
  name: string

  @Column()
  link: string

  @Column({ type: 'jsonb', default: {} })
  content: Record<string, any>

  @Column({ type: 'integer', default: 0 })
  views: number

  @ManyToMany(() => User, (user) => user.favoriteBloggers)
  favoritedBy: User[]
}
