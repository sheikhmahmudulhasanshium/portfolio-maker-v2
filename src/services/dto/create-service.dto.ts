// src/services/dto/create-service.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsInt, Min } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description:
      'The relative path or URL to the icon image file (e.g., /fire.svg)',
    example: '/fire.svg',
  })
  @IsString()
  @IsNotEmpty()
  iconLink: string;

  @ApiProperty({
    description: 'The emoji representation of the icon',
    example: '🔥',
  })
  @IsString()
  @IsNotEmpty()
  icon: string;

  @ApiProperty({
    description: 'The title of the service/feature',
    example: 'PMF?!',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'A detailed description of the service/feature',
    example: 'Everyone I worked with said they’d be Extremely Disappointed...',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The display order/position of the feature (starting from 1)',
    example: 1,
    minimum: 1, // Good practice to indicate the minimum value in Swagger
  })
  @IsNumber()
  @IsInt() // Ensure it's a whole number
  @Min(1) // Ensure position starts from 1 (or 0 if you prefer)
  position: number;
}
