import { IsString, IsNotEmpty, MaxLength, Matches } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[A-Za-z0-9-_]+$/, {
    message: 'Project code can only contain letters, numbers, hyphens and underscores',
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
