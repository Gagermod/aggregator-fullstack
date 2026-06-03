import { Type } from 'class-transformer'
import {
  IsArray,
  IsString,
  IsUrl,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator'

class LinkDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsUrl()
  url: string

  @IsString()
  @IsNotEmpty()
  type: string
}

export class CreateSuggestionDto {
  @IsString()
  @IsNotEmpty()
  bloggerName: string

  @IsString()
  @IsNotEmpty()
  contentType: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  links: LinkDto[]
}
