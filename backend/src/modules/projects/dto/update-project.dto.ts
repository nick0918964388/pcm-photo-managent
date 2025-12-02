import { IsString, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { ProjectStatus } from '../../../database/entities/project.entity';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;
}
