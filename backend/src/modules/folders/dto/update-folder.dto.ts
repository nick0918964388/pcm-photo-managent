import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateFolderDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;
}
