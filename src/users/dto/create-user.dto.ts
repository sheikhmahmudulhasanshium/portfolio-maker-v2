// src/users/dto/create-user.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator'; // Added IsUrl
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Clerk User ID', example: 'user_2abcd...' })
  @IsString()
  @IsNotEmpty()
  clerkId: string;

  @ApiProperty({ description: 'User Email', example: 'test@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ description: 'User First Name', example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ description: 'User Last Name', example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;

  // Add profileImageUrl to DTO as well for consistency, though primarily handled by sync
  @ApiPropertyOptional({
    description: 'URL of the user profile image',
    example: 'https://...',
  })
  @IsUrl()
  @IsOptional()
  profileImageUrl?: string;
}
