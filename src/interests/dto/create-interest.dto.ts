import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  Min,
  IsOptional, // Added
} from 'class-validator';

export class CreateInterestDto {
  @ApiProperty({
    description: 'The title or name of the interest',
    example: 'Nature Lover',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'A short description of the interest',
    example: 'Enjoy planting trees and connecting with nature.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The emoji representing the interest',
    example: '⛺',
  })
  @IsString()
  @IsNotEmpty() // Emoji should likely be required and non-empty
  icon: string;

  @ApiProperty({
    description: 'The relative path or URL to an optional icon image',
    example: '/images/interests/jungle.png',
    required: false, // Explicitly false
  })
  @IsOptional() // Make the field optional
  @IsString() // If provided, it must be a string
  iconPath?: string; // Mark as optional in TypeScript type

  @ApiProperty({
    description: 'The display order/position of the interest (starting from 1)',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @IsInt()
  @Min(1)
  position: number;
}
