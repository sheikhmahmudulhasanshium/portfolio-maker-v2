// src/social-handles/social-handles.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes, // Recommended to ensure ValidationPipe runs if not global
  ValidationPipe, // Import ValidationPipe
} from '@nestjs/common';
import { SocialHandlesService } from './social-handles.service';
import { CreateSocialHandleDto } from './dto/create-social-handle.dto';
import { UpdateSocialHandleDto } from './dto/update-social-handle.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { SocialHandle } from './entities/social-handle.entity';

@ApiTags('social-handles')
@Controller('social-handles')
// Apply validation pipe specifically here if it's not configured globally in main.ts
// This ensures DTOs are validated before reaching the service
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class SocialHandlesController {
  constructor(private readonly socialHandlesService: SocialHandlesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new social handle' })
  @ApiBody({ type: CreateSocialHandleDto })
  @ApiCreatedResponse({
    description: 'The social handle has been successfully created.',
    type: SocialHandle,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request (validation failed or invalid data)',
  })
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createSocialHandleDto: CreateSocialHandleDto,
  ): Promise<SocialHandle> {
    // Validation handled by ValidationPipe
    return this.socialHandlesService.create(createSocialHandleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all social handles (sorted by position)' })
  @ApiOkResponse({
    description: 'List of all social handles.',
    type: [SocialHandle],
  })
  findAll(): Promise<SocialHandle[]> {
    return this.socialHandlesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single social handle by ID' })
  @ApiParam({
    name: 'id',
    description: 'The MongoDB ObjectId of the social handle',
    type: String,
    example: '605c72ef5f1b2c001f7b0f0b',
  })
  @ApiOkResponse({
    description: 'The found social handle record',
    type: SocialHandle,
  })
  @ApiNotFoundResponse({ description: 'Social Handle not found' })
  @ApiBadRequestResponse({ description: 'Invalid ID format' })
  findOne(@Param('id') id: string): Promise<SocialHandle> {
    // ID format validation is handled within the service's try/catch block
    return this.socialHandlesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a social handle by ID' })
  @ApiParam({
    name: 'id',
    description: 'The MongoDB ObjectId of the social handle to update',
    type: String,
    example: '605c72ef5f1b2c001f7b0f0b',
  })
  @ApiBody({ type: UpdateSocialHandleDto, description: 'Fields to update' })
  @ApiOkResponse({
    description: 'The social handle has been successfully updated.',
    type: SocialHandle,
  })
  @ApiNotFoundResponse({ description: 'Social Handle not found' })
  @ApiBadRequestResponse({
    description: 'Bad Request (validation failed or invalid ID format)',
  })
  update(
    @Param('id') id: string,
    @Body() updateSocialHandleDto: UpdateSocialHandleDto,
  ): Promise<SocialHandle> {
    // DTO Validation handled by ValidationPipe
    // ID format validation handled within the service
    return this.socialHandlesService.update(id, updateSocialHandleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a social handle by ID' })
  @ApiParam({
    name: 'id',
    description: 'The MongoDB ObjectId of the social handle to delete',
    type: String,
    example: '605c72ef5f1b2c001f7b0f0b',
  })
  @ApiOkResponse({
    description:
      'The social handle has been successfully deleted (returns the deleted object).',
    type: SocialHandle,
  })
  @ApiNotFoundResponse({ description: 'Social Handle not found' })
  @ApiBadRequestResponse({ description: 'Invalid ID format' })
  @HttpCode(HttpStatus.OK) // 200 OK is common for DELETE returning the object
  // Or use @HttpCode(HttpStatus.NO_CONTENT) and change return type to Promise<void> if you don't want to return the object
  remove(@Param('id') id: string): Promise<SocialHandle> {
    // ID format validation handled within the service
    return this.socialHandlesService.remove(id);
  }
}
