import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsDateString,
  IsBoolean,
  IsEnum,
  ValidateNested,
  IsArray,
  IsNumber,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// --- Nested DTOs ---

class LocationDto {
  @ApiProperty({ description: 'Country name', example: 'United States' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiPropertyOptional({ description: 'City name', example: 'New York' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({
    description: 'State or Province name',
    example: 'New York',
  })
  @IsString()
  @IsOptional()
  stateOrProvince?: string;
}

class CourseDto {
  @ApiProperty({
    description: 'Name of the course',
    example: 'Introduction to Algorithms',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Course code', example: 'CS101' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ description: 'Brief description of the course' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Grade received', example: 'A' })
  @IsString()
  @IsOptional()
  grade?: string;

  @ApiPropertyOptional({
    description: 'Number of credits for the course',
    example: 3,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  credits?: number;
}

class ExtraCurricularDto {
  @ApiProperty({ description: 'Name of the activity', example: 'Debate Club' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of the activity/involvement' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Role held in the activity',
    example: 'President',
  })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({
    description: 'Duration of involvement',
    example: '2 years',
  })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'URLs to related media (images, videos)',
    example: ['https://example.com/debate_photo.jpg'],
  })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  mediaUrls?: string[];
}

class AwardDto {
  @ApiProperty({
    description: 'Name of the award/honor',
    example: "Dean's List",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of the award' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Organization or entity that issued the award',
    example: 'Faculty of Engineering',
  })
  @IsString()
  @IsOptional()
  issuer?: string;

  @ApiPropertyOptional({
    description: 'Year the award was received',
    example: '2021',
  })
  @IsString()
  @IsOptional()
  year?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'URLs to related media (certificates, photos)',
    example: ['https://example.com/award_cert.pdf'],
  })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  mediaUrls?: string[];
}

class ThesisDto {
  @ApiProperty({ description: 'Title of the thesis' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Abstract or description of the thesis' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Name of the supervising professor' })
  @IsString()
  @IsOptional()
  supervisor?: string;

  @ApiPropertyOptional({
    description: 'Institution where the thesis was submitted',
  })
  @IsString()
  @IsOptional()
  institution?: string;

  @ApiPropertyOptional({
    description: 'Year of completion/submission',
    example: '2022',
  })
  @IsString()
  @IsOptional()
  year?: string;

  @ApiPropertyOptional({
    description: 'URL to the thesis document (PDF, etc.)',
  })
  @IsUrl()
  @IsOptional()
  documentUrl?: string;
}

class ProjectDto {
  @ApiProperty({ description: 'Title of the project' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description of the project' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Technologies used',
    example: ['Node.js', 'React', 'MongoDB'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  technologiesUsed?: string[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Names of collaborators',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  collaborators?: string[];

  @ApiPropertyOptional({
    description: 'URL to the project repository (e.g., GitHub)',
  })
  @IsUrl()
  @IsOptional()
  repositoryUrl?: string;

  @ApiPropertyOptional({ description: 'URL to a live demo of the project' })
  @IsUrl()
  @IsOptional()
  liveDemoUrl?: string;

  @ApiPropertyOptional({
    description: 'Year the project was completed',
    example: '2021',
  })
  @IsString()
  @IsOptional()
  year?: string;
}

class PublicationDto {
  @ApiProperty({ description: 'Title of the publication' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Name of the journal or conference' })
  @IsString()
  @IsNotEmpty()
  journalOrConference: string;

  @ApiProperty({ type: [String], description: 'List of authors' })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  authors: string[];

  @ApiProperty({ description: 'Year of publication', example: '2023' })
  @IsString()
  @IsNotEmpty()
  year: string;

  @ApiPropertyOptional({ description: 'URL to the publication online' })
  @IsUrl()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({ description: 'Digital Object Identifier (DOI)' })
  @IsString()
  @IsOptional()
  doi?: string;
}

class CertificationDto {
  @ApiProperty({
    description: 'Name of the certification',
    example: 'AWS Certified Solutions Architect - Associate',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Organization that issued the certification',
    example: 'Amazon Web Services',
  })
  @IsString()
  @IsNotEmpty()
  issuingOrganization: string;

  @ApiProperty({
    description: 'Date the certification was issued (YYYY-MM-DD)',
    example: '2023-01-15',
  })
  @IsDateString()
  @IsNotEmpty()
  issueDate: string;

  @ApiPropertyOptional({
    description: 'Expiration date of the certification (YYYY-MM-DD)',
    example: '2026-01-15',
  })
  @IsDateString()
  @IsOptional()
  expirationDate?: string;

  @ApiPropertyOptional({ description: 'Credential ID or number' })
  @IsString()
  @IsOptional()
  credentialId?: string;

  @ApiPropertyOptional({ description: 'URL to verify the credential' })
  @IsUrl()
  @IsOptional()
  credentialUrl?: string;
}

class ActivitiesDto {
  @ApiPropertyOptional({
    type: [ExtraCurricularDto],
    description: 'List of extracurricular activities',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExtraCurricularDto)
  extraCurriculars?: ExtraCurricularDto[];

  @ApiPropertyOptional({
    type: [AwardDto],
    description: 'List of awards and honors',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AwardDto)
  awards?: AwardDto[];

  @ApiPropertyOptional({
    type: [ThesisDto],
    description: 'Details of thesis work',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ThesisDto)
  theses?: ThesisDto[];

  @ApiPropertyOptional({
    type: [ProjectDto],
    description: 'List of academic or personal projects',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectDto)
  projects?: ProjectDto[];

  @ApiPropertyOptional({
    type: [PublicationDto],
    description: 'List of publications',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PublicationDto)
  publications?: PublicationDto[];

  @ApiPropertyOptional({
    type: [CertificationDto],
    description: 'List of relevant certifications',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationDto)
  certifications?: CertificationDto[];
}

// --- Main CreateEducationDto Class ---

export class CreateEducationDto {
  @ApiProperty({
    description: 'Degree obtained',
    example: 'Bachelor of Science',
  })
  @IsString()
  @IsNotEmpty()
  readonly degree: string;

  @ApiPropertyOptional({
    description: 'General field of study',
    example: 'Engineering',
  })
  @IsString()
  @IsOptional()
  readonly field?: string;

  @ApiPropertyOptional({
    description: 'Specific domain within the field',
    example: 'Computer Science',
  })
  @IsString()
  @IsOptional()
  readonly domain?: string;

  @ApiProperty({
    description: 'Name of the institution',
    example: 'University of Example',
  })
  @IsString()
  @IsNotEmpty()
  readonly institute: string;

  @ApiProperty({
    description: 'Start date in ISO format (YYYY-MM-DD or YYYY)',
    example: '2018-09-01',
  })
  @IsDateString() // Consider validation options if only YYYY is allowed sometimes
  @IsNotEmpty()
  readonly startDate: string;

  @ApiProperty({
    description: 'Result obtained (e.g., GPA, Percentage, Grade)',
    example: '3.8 GPA',
  })
  @IsString()
  @IsNotEmpty()
  readonly result: string;

  // --- activities is now optional ---
  @ApiPropertyOptional({
    // Changed to Optional
    type: ActivitiesDto,
    description: 'Various activities undertaken during education (optional)',
  })
  @ValidateNested()
  @Type(() => ActivitiesDto)
  @IsOptional() // Added IsOptional, removed IsNotEmpty
  readonly activities?: ActivitiesDto; // Added '?'

  // Optional fields
  @ApiPropertyOptional({
    description: 'End date in ISO format (YYYY-MM-DD or YYYY)',
    example: '2022-06-15',
  })
  @IsDateString() // Consider validation options if only YYYY is allowed sometimes
  @IsOptional()
  readonly endDate?: string;

  @ApiPropertyOptional({
    description: 'Is this the current education status?',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  readonly isCurrent?: boolean;

  @ApiPropertyOptional({
    description: 'Further description of the education',
    example: 'Focused on AI and Machine Learning.',
  })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({
    description: 'Specific major subject(s)',
    example: 'Artificial Intelligence',
  })
  @IsString()
  @IsOptional()
  readonly major?: string;

  @ApiPropertyOptional({
    description: 'Educational board (if applicable, e.g., for school)',
    example: 'State Board',
  })
  @IsString()
  @IsOptional()
  readonly board?: string;

  @ApiPropertyOptional({
    description: 'Group (if applicable, e.g., Science, Arts)',
    example: 'Science',
  })
  @IsString()
  @IsOptional()
  readonly group?: string;

  @ApiPropertyOptional({
    type: LocationDto,
    description: 'Location of the institution',
  })
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  readonly location?: LocationDto;

  @ApiPropertyOptional({
    enum: ['Online', 'On-Campus', 'Hybrid'],
    description: 'Mode of study',
    example: 'On-Campus',
  })
  @IsEnum(['Online', 'On-Campus', 'Hybrid'])
  @IsOptional()
  readonly modeOfStudy?: 'Online' | 'On-Campus' | 'Hybrid';

  @ApiPropertyOptional({
    type: [CourseDto],
    description: 'List of relevant courses taken',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseDto)
  @IsOptional()
  readonly courses?: CourseDto[];

  @ApiPropertyOptional({
    description: 'URL for the institution logo',
    example: 'https://example.com/logo.png',
  })
  @IsUrl()
  @IsOptional()
  readonly logoUrl?: string;

  @ApiPropertyOptional({
    description: 'Order for displaying on the frontend',
    example: 1,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly displayOrder?: number;
}
