import { User } from '../user/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export type SuggestionStatus = 'pending' | 'approved' | 'rejected'

@Entity()
export class Suggestion {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  bloggerName: string

  @Column()
  contentType: string

  @Column({ type: 'jsonb' })
  links: { title: string; url: string; type: string }[]

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: SuggestionStatus

  @ManyToOne(() => User, { eager: true })
  submittedBy: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
