import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  // No ParseMongoIdPipe import needed
} from '@nestjs/common';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Education } from './entities/education.entity';
// No ParseMongoIdPipe import

@ApiTags('education')
@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new education record' })
  @ApiBody({ type: CreateEducationDto })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Education,
  })
  @ApiResponse({ status: 400, description: 'Bad Request. Validation failed.' })
  create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createEducationDto: CreateEducationDto,
  ): Promise<Education> {
    return this.educationService.create(createEducationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all education records' })
  @ApiResponse({
    status: 200,
    description: 'List of all education records.',
    type: [Education],
  })
  findAll(): Promise<Education[]> {
    return this.educationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single education record by ID' })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the education record', // Updated description
    type: String,
    example: '60d5ecb8b4854b3d8c8a8f49',
  })
  @ApiResponse({
    status: 200,
    description: 'The education record.',
    type: Education,
  })
  @ApiResponse({
    status: 404,
    description:
      'Education record not found (or potentially invalid ID format causing CastError).',
  }) // Updated description
  @ApiResponse({
    status: 400,
    description:
      'Bad Request (potentially from Mongoose CastError if ID format is invalid).',
  }) // Updated description
  findOne(
    @Param('id') id: string, // No pipe used here
  ): Promise<Education> {
    // The service's findOne will now handle potential CastErrors if 'id' is invalid format
    return this.educationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing education record' })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the education record to update', // Updated description
    type: String,
    example: '60d5ecb8b4854b3d8c8a8f49',
  })
  @ApiBody({ type: UpdateEducationDto })
  @ApiResponse({
    status: 200,
    description: 'The updated education record.',
    type: Education,
  })
  @ApiResponse({
    status: 404,
    description:
      'Education record not found (or potentially invalid ID format causing CastError).',
  }) // Updated description
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. DTO Validation failed (or potentially from Mongoose CastError if ID format is invalid).', // Updated description
  })
  update(
    @Param('id') id: string, // No pipe used here
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
      }),
    )
    updateEducationDto: UpdateEducationDto,
  ): Promise<Education> {
    // The service's update will now handle potential CastErrors if 'id' is invalid format
    return this.educationService.update(id, updateEducationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an education record by ID' })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the education record to delete', // Updated description
    type: String,
    example: '60d5ecb8b4854b3d8c8a8f49',
  })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Education record not found (or potentially invalid ID format causing CastError).',
  }) // Updated description
  @ApiResponse({
    status: 400,
    description:
      'Bad Request (potentially from Mongoose CastError if ID format is invalid).',
  }) // Updated description
  remove(
    @Param('id') id: string, // No pipe used here
  ): Promise<{ deleted: boolean; id: string }> {
    // The service's remove will now handle potential CastErrors if 'id' is invalid format
    return this.educationService.remove(id);
  }
}
