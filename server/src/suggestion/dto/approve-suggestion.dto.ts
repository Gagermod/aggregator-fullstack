import { IsOptional, IsString } from 'class-validator';

export class ApproveSuggestionDto {
  @IsString()
  @IsOptional()
  title?: string;
}
