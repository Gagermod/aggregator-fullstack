import { IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @MinLength(3, { message: 'Login must be at least 3 characters long' })
  @MaxLength(20, { message: 'Login cannot exceed 20 characters' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Login can only contain letters, numbers, underscores and hyphens',
  })
  login: string

  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string
}
