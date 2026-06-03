import { IsString, IsUrl, IsNotEmpty } from 'class-validator';

export class ContentLinkDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUrl()
  url: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
