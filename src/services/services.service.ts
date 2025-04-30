// src/services/services.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // Import Types
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
// Adjust path if your schema is in schemas/ folder (e.g., './schemas/service.schema')
import { Service, ServiceDocument } from './entities/service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    console.log('--- SERVICE CREATE ---');
    console.log('Received DTO:', createServiceDto);
    const createdService = new this.serviceModel(createServiceDto);
    const savedService = await createdService.save();
    console.log('Saved Service:', savedService);
    return savedService;
  }

  async findAll(): Promise<Service[]> {
    console.log('--- SERVICE FIND ALL ---');
    const services = await this.serviceModel
      .find()
      .sort({ position: 1 })
      .exec();
    console.log(`Found ${services.length} services.`);
    return services;
  }

  async findOne(id: string): Promise<Service> {
    console.log(`--- SERVICE FIND ONE ---`);
    console.log(`Attempting to find document with ID: [${id}]`);
    console.log(`Is the ID a valid ObjectId? ${Types.ObjectId.isValid(id)}`);

    // Validate ID format before querying
    if (!Types.ObjectId.isValid(id)) {
      console.error(`Invalid ObjectId format for ID: [${id}]`);
      throw new NotFoundException(`Invalid ID format: "${id}"`);
    }

    const service = await this.serviceModel.findById(id).exec();

    if (!service) {
      console.error(`Document with ID [${id}] NOT FOUND.`);
      throw new NotFoundException(`Service with ID "${id}" not found`);
    }
    console.log(`Document with ID [${id}] FOUND:`, service);
    return service;
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    console.log(`--- SERVICE UPDATE START ---`);
    console.log(`Attempting to update document with ID: [${id}]`);
    console.log(`Is the ID a valid ObjectId? ${Types.ObjectId.isValid(id)}`);

    // Validate ID format before querying
    if (!Types.ObjectId.isValid(id)) {
      console.error(`Invalid ObjectId format for ID: [${id}]`);
      throw new NotFoundException(`Invalid ID format for update: "${id}"`);
    }

    // Explicitly check if the document exists before trying to update it
    // This helps confirm the ID is valid *and* exists
    let docBeforeUpdate: ServiceDocument | null = null;
    try {
      docBeforeUpdate = await this.serviceModel.findById(id).exec();
      if (!docBeforeUpdate) {
        // If not found here, findByIdAndUpdate will also fail, so we can throw early
        console.error(
          `!!! Document with ID [${id}] NOT FOUND before attempting update. Throwing NotFoundException.`,
        );
        throw new NotFoundException(
          `Service with ID "${id}" not found for update.`,
        );
      } else {
        console.log(
          `Document with ID [${id}] FOUND before update. Current state:`,
          docBeforeUpdate,
        );
      }
    } catch (err) {
      // Catch potential errors during the findById check itself
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(
        `Error checking for document existence before update for ID [${id}]: ${errorMessage}`,
      );
      // Rethrow or handle as appropriate, maybe throw a generic server error
      throw err; // Re-throwing might be safest
    }

    console.log(
      `Calling findByIdAndUpdate with ID: [${id}] and DTO:`,
      updateServiceDto,
    );
    // Since we confirmed existence above, this call should primarily handle the update itself
    const existingService = await this.serviceModel
      .findByIdAndUpdate(id, updateServiceDto, { new: true }) // {new: true} returns the updated document
      .exec();

    console.log(`--- SERVICE UPDATE AFTERMATH ---`);
    // Due to the pre-check, existingService should ideally not be null here unless
    // there's a rare race condition or unexpected Mongoose behavior.
    if (!existingService) {
      // This case is less likely now but kept for robustness
      console.error(
        `findByIdAndUpdate returned NULL for ID: [${id}] unexpectedly after pre-check. Throwing NotFoundException.`,
      );
      throw new NotFoundException(
        `Service with ID "${id}" could not be updated (unexpectedly not found after check).`,
      );
    } else {
      console.log(
        `findByIdAndUpdate SUCCESS. Returned updated document:`,
        existingService,
      );

      // Use String() constructor for safer type conversion that often satisfies linters
      const returnedIdString = String(existingService._id);

      const inputIdMatchesReturnedId = returnedIdString === id;
      console.log(
        `Does updated doc ID (${returnedIdString}) match input ID (${id})? ${inputIdMatchesReturnedId}`,
      );
      if (!inputIdMatchesReturnedId) {
        // This signifies a major internal issue if it ever happens
        console.error(
          `!!! CRITICAL MISMATCH: Input ID [${id}] does not match the ID of the document returned by findByIdAndUpdate [${returnedIdString}]! This should not happen.`,
        );
      }
    }

    return existingService;
  }

  async remove(id: string): Promise<{ deleted: boolean; _id?: string }> {
    console.log(`--- SERVICE REMOVE ---`);
    console.log(`Attempting to delete document with ID: [${id}]`);
    console.log(`Is the ID a valid ObjectId? ${Types.ObjectId.isValid(id)}`);

    // Validate ID format before querying
    if (!Types.ObjectId.isValid(id)) {
      console.error(`Invalid ObjectId format for ID: [${id}]`);
      throw new NotFoundException(`Invalid ID format for delete: "${id}"`);
    }

    const result = await this.serviceModel.deleteOne({ _id: id }).exec();
    console.log('Deletion result:', result);

    // Check if any document was actually deleted
    if (result.deletedCount === 0) {
      console.error(`Document with ID [${id}] NOT FOUND for deletion.`);
      // Throw NotFoundException because the resource to be deleted was not found
      throw new NotFoundException(
        `Service with ID "${id}" not found for deletion.`,
      );
    }

    console.log(`Document with ID [${id}] successfully deleted.`);
    return { deleted: true, _id: id };
  }
}
