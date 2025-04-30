import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  HttpCode,
  HttpStatus,
  ValidationPipe, // Ensure ValidationPipe is used globally or here
} from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiParam,
  ApiBody, // Can be useful for explicit body examples
} from '@nestjs/swagger';
// Adjust path if needed
import { Interest } from './entities/interest.entity';
import { Types } from 'mongoose'; // Import Types for ObjectId validation if needed here

@ApiTags('interests')
@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new interest' })
  @ApiCreatedResponse({
    description: 'The interest has been successfully created.',
    type: Interest,
  })
  @ApiBody({ type: CreateInterestDto })
  create(
    @Body(ValidationPipe) createInterestDto: CreateInterestDto,
  ): Promise<Interest> {
    console.log(`CONTROLLER: Received POST /interests request`);
    // Assuming the service handles its errors and might throw specific NestJS exceptions
    return this.interestsService.create(createInterestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all interests (ordered by position)' })
  @ApiOkResponse({
    description: 'List of all interests retrieved successfully.',
    type: [Interest],
  })
  findAll(): Promise<Interest[]> {
    console.log(`CONTROLLER: Received GET /interests request`);
    return this.interestsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific interest by ID' })
  @ApiParam({
    name: 'id',
    description: 'The MongoDB ObjectId of the interest to retrieve',
    type: String,
    example: '60f7e1d5a7b3c8a4e4a8b4a0',
  })
  @ApiOkResponse({
    description: 'Interest found and retrieved.',
    type: Interest,
  })
  @ApiNotFoundResponse({
    description:
      'Interest with the specified ID not found or invalid ID format.',
  })
  async findOne(@Param('id') id: string): Promise<Interest> {
    console.log(`CONTROLLER: Received GET /interests/${id} request`);
    if (!Types.ObjectId.isValid(id)) {
      console.warn(`CONTROLLER: Invalid ObjectId format received: ${id}`);
      throw new NotFoundException(`Invalid ID format: "${id}"`);
    }
    try {
      const interest = await this.interestsService.findOne(id);
      return interest;
    } catch (error) {
      // Service should throw specific exceptions like NotFoundException
      // If it throws a generic error, handle it safely
      if (error instanceof Error) {
        // Check if it's an Error instance
        console.error(
          `CONTROLLER: Error in GET /interests/${id}: ${error.message}`, // Safe access
        );
      } else {
        console.error(
          `CONTROLLER: Non-Error thrown in GET /interests/${id}:`,
          error, // Log the unknown error object
        );
      }
      // Re-throw the original error regardless of type
      // NestJS exception filter will handle known HTTP exceptions
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing interest' })
  @ApiParam({
    name: 'id',
    description: 'The MongoDB ObjectId of the interest to update',
    type: String,
    example: '60f7e1d5a7b3c8a4e4a8b4a0',
  })
  @ApiOkResponse({
    description: 'Interest updated successfully.',
    type: Interest,
  })
  @ApiNotFoundResponse({
    description:
      'Interest with the specified ID not found or invalid ID format.',
  })
  @ApiBody({ type: UpdateInterestDto })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateInterestDto: UpdateInterestDto,
  ): Promise<Interest> {
    console.log(`CONTROLLER: Received PATCH /interests/${id} request`);
    if (!Types.ObjectId.isValid(id)) {
      console.warn(
        `CONTROLLER: Invalid ObjectId format received for update: ${id}`,
      );
      throw new NotFoundException(`Invalid ID format for update: "${id}"`);
    }
    try {
      const updatedInterest = await this.interestsService.update(
        id,
        updateInterestDto,
      );
      return updatedInterest;
    } catch (error) {
      if (error instanceof Error) {
        // Check if it's an Error instance
        console.error(
          `CONTROLLER: Error in PATCH /interests/${id}: ${error.message}`, // Safe access
        );
      } else {
        console.error(
          `CONTROLLER: Non-Error thrown in PATCH /interests/${id}:`,
          error, // Log the unknown error object
        );
      }
      // Re-throw the original error
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an interest' })
  @ApiParam({
    name: 'id',
    description: 'The MongoDB ObjectId of the interest to delete',
    type: String,
    example: '60f7e1d5a7b3c8a4e4a8b4a0',
  })
  @ApiNoContentResponse({ description: 'Interest deleted successfully.' })
  @ApiNotFoundResponse({
    description:
      'Interest with the specified ID not found or invalid ID format.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    console.log(`CONTROLLER: Received DELETE /interests/${id} request`);
    if (!Types.ObjectId.isValid(id)) {
      console.warn(
        `CONTROLLER: Invalid ObjectId format received for delete: ${id}`,
      );
      throw new NotFoundException(`Invalid ID format for delete: "${id}"`);
    }
    try {
      await this.interestsService.remove(id);
      // No return needed for void Promise
    } catch (error) {
      if (error instanceof Error) {
        // Check if it's an Error instance
        console.error(
          `CONTROLLER: Error in DELETE /interests/${id}: ${error.message}`, // Safe access
        );
      } else {
        console.error(
          `CONTROLLER: Non-Error thrown in DELETE /interests/${id}:`,
          error, // Log the unknown error object
        );
      }
      // Re-throw the original error
      throw error;
    }
  }
}
