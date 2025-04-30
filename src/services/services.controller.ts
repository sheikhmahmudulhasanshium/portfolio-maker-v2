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
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiParam,
} from '@nestjs/swagger';
// Adjust path if your schema is in schemas/ folder
import { Service } from './entities/service.entity';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service feature' })
  @ApiCreatedResponse({
    description: 'The service has been successfully created.',
    type: Service,
  })
  create(@Body() createServiceDto: CreateServiceDto): Promise<Service> {
    console.log(`CONTROLLER: Received POST /services request`);
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all service features (ordered by position)',
  })
  @ApiOkResponse({
    description: 'List of all services retrieved successfully.',
    type: [Service],
  })
  findAll(): Promise<Service[]> {
    console.log(`CONTROLLER: Received GET /services request`);
    return this.servicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific service feature by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the service to retrieve',
    type: String,
  })
  @ApiOkResponse({ description: 'Service found and retrieved.', type: Service })
  @ApiNotFoundResponse({
    description: 'Service with the specified ID not found.',
  })
  async findOne(@Param('id') id: string): Promise<Service> {
    console.log(`CONTROLLER: Received GET /services/${id} request`);
    try {
      return await this.servicesService.findOne(id);
    } catch (error) {
      // --- FIX START ---
      if (error instanceof NotFoundException) {
        console.error(
          `CONTROLLER: NotFoundException in GET /services/${id}: ${error.message}`,
        );
        throw error; // Re-throw the specific NestJS exception
      } else if (error instanceof Error) {
        console.error(
          `CONTROLLER: Error in GET /services/${id}: ${error.message}`,
        );
      } else {
        console.error(
          `CONTROLLER: Unknown error in GET /services/${id}:`,
          error,
        );
      }
      // Ensure an appropriate HTTP error is thrown if not NotFoundException
      throw error; // Re-throw original error or a generic one
      // --- FIX END ---
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing service feature' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the service to update',
    type: String,
  })
  @ApiOkResponse({
    description: 'Service updated successfully.',
    type: Service,
  })
  @ApiNotFoundResponse({
    description: 'Service with the specified ID not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    console.log(`CONTROLLER: Received PATCH /services/${id} request`);
    try {
      return await this.servicesService.update(id, updateServiceDto);
    } catch (error) {
      // --- FIX START ---
      if (error instanceof NotFoundException) {
        console.error(
          `CONTROLLER: NotFoundException in PATCH /services/${id}: ${error.message}`,
        );
        throw error; // Re-throw the specific NestJS exception
      } else if (error instanceof Error) {
        console.error(
          `CONTROLLER: Error in PATCH /services/${id}: ${error.message}`,
        );
      } else {
        console.error(
          `CONTROLLER: Unknown error in PATCH /services/${id}:`,
          error,
        );
      }
      // Ensure an appropriate HTTP error is thrown if not NotFoundException
      throw error; // Re-throw original error or a generic one
      // --- FIX END ---
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a service feature' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the service to delete',
    type: String,
  })
  @ApiNoContentResponse({ description: 'Service deleted successfully.' })
  @ApiNotFoundResponse({
    description: 'Service with the specified ID not found.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    console.log(`CONTROLLER: Received DELETE /services/${id} request`);
    try {
      await this.servicesService.remove(id);
    } catch (error) {
      // --- FIX START ---
      if (error instanceof NotFoundException) {
        console.error(
          `CONTROLLER: NotFoundException in DELETE /services/${id}: ${error.message}`,
        );
        throw error; // Re-throw the specific NestJS exception
      } else if (error instanceof Error) {
        console.error(
          `CONTROLLER: Error in DELETE /services/${id}: ${error.message}`,
        );
      } else {
        console.error(
          `CONTROLLER: Unknown error in DELETE /services/${id}:`,
          error,
        );
      }
      // Ensure an appropriate HTTP error is thrown if not NotFoundException
      throw error; // Re-throw original error or a generic one
      // --- FIX END ---
    }
  }
}
