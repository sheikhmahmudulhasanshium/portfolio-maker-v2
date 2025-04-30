// src/social-handles/dto/create-social-handle.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

export class CreateSocialHandleDto {
  @ApiProperty({
    description: 'Name of the social platform (e.g., linkedin, github, gmail)',
    example: 'linkedin',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description:
      'Link or handle for the social platform (URL, email, username etc.)',
    example: 'https://linkedin.com/in/developercontact',
  })
  @IsString()
  @IsNotEmpty()
  link: string;

  @ApiPropertyOptional({
    // Use ApiPropertyOptional for optional fields in Swagger
    description: 'Whether to hide this social handle from public view',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional() // Make it optional in the DTO validation
  hide?: boolean; // Use optional modifier `?`. Default value handled by schema.

  @ApiProperty({
    description: 'Display order position (lower numbers appear first)',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  position: number;
}
