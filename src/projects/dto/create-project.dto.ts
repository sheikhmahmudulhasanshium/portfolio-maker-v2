// src/projects/dto/create-project.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer'; // Needed for nested validation
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsUrl,
  IsBoolean,
  ValidateNested,
  IsDateString,
  IsEnum,
} from 'class-validator'; // Import necessary decorators

// Define a DTO for the nested timeline object
class TimelineDto {
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @IsDateString()
  @IsNotEmpty()
  end_date: string;
}

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional() // Assuming subtitle is optional, adjust if needed
  subtitle: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true }) // Validate each element in the array
  @IsNotEmpty({ each: true })
  technologies: string[];

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  repoUrl: string;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  liveUrl: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUrl({}, { each: true }) // Validate each element as URL
  @IsNotEmpty({ each: true })
  previewImageUrls: string[];

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  iconUrl: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  featured: boolean;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiProperty({
    /* ... Swagger definition ... */
  })
  @ValidateNested() // Tell validator to validate the nested object
  @Type(() => TimelineDto) // Tell class-transformer which DTO to use for the nested object
  @IsNotEmpty()
  timeline: TimelineDto; // Use the nested DTO type

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isUpcoming: boolean;

  @ApiProperty({ enum: ['start', 'ongoing', 'done', 'canceled', 'upcoming'] })
  @IsEnum(['start', 'ongoing', 'done', 'canceled', 'upcoming'])
  @IsNotEmpty()
  status: 'start' | 'ongoing' | 'done' | 'canceled' | 'upcoming';
}
