// src/social-handles/social-handles.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error as MongooseError } from 'mongoose';
import { CreateSocialHandleDto } from './dto/create-social-handle.dto';
import { UpdateSocialHandleDto } from './dto/update-social-handle.dto';
import {
  SocialHandle,
  SocialHandleDocument,
} from './entities/social-handle.entity';

@Injectable()
export class SocialHandlesService {
  constructor(
    @InjectModel(SocialHandle.name)
    private socialHandleModel: Model<SocialHandleDocument>,
  ) {}

  async create(
    createSocialHandleDto: CreateSocialHandleDto,
  ): Promise<SocialHandle> {
    const createdSocialHandle = new this.socialHandleModel(
      createSocialHandleDto,
    );
    try {
      return await createdSocialHandle.save();
    } catch (error: unknown) {
      // Explicitly type error as unknown
      // Handle Mongoose validation errors first (more specific)
      if (error instanceof MongooseError.ValidationError) {
        throw new BadRequestException(`Validation failed: ${error.message}`);
      }

      // Check for duplicate key errors directly
      let isDuplicateError = false;
      // Verify it's an object and has 'code' before trying to access
      if (typeof error === 'object' && error !== null && 'code' in error) {
        // Now that we know 'code' exists, access it using assertion
        if ((error as { code: unknown }).code === 11000) {
          isDuplicateError = true;
        }
      }

      if (isDuplicateError) {
        throw new BadRequestException(
          'A social handle with similar properties already exists.',
        );
      }

      // Log and throw for other errors
      console.error('Error creating social handle:', error);
      // Re-throwing the original error might be better for higher-level error handlers
      // throw error;
      // Or throw a generic bad request
      throw new BadRequestException('Could not create social handle.');
    }
  }

  async findAll(): Promise<SocialHandle[]> {
    // No ID involved here, no change needed for error handling
    return this.socialHandleModel.find().sort({ position: 1 }).exec();
  }

  async findOne(id: string): Promise<SocialHandle> {
    let socialHandle: SocialHandleDocument | null;
    try {
      socialHandle = await this.socialHandleModel.findById(id).exec();
    } catch (error: unknown) {
      // Explicitly type error as unknown
      // Catch potential CastError if ID format is invalid
      if (error instanceof MongooseError.CastError) {
        // This check is specific and safe
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
      console.error(`Error finding social handle ${id}:`, error);
      throw error; // Re-throw other unexpected errors
    }

    if (!socialHandle) {
      throw new NotFoundException(`Social Handle with ID "${id}" not found`);
    }
    return socialHandle;
  }

  async update(
    id: string,
    updateSocialHandleDto: UpdateSocialHandleDto,
  ): Promise<SocialHandle> {
    let updatedSocialHandle: SocialHandleDocument | null;
    try {
      updatedSocialHandle = await this.socialHandleModel
        .findByIdAndUpdate(id, updateSocialHandleDto, {
          new: true,
          runValidators: true,
        })
        .exec();
    } catch (error: unknown) {
      // Explicitly type error as unknown
      // Catch potential CastError if ID format is invalid
      if (error instanceof MongooseError.CastError) {
        // This check is specific and safe
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
      // Handle Mongoose validation errors during update
      if (error instanceof MongooseError.ValidationError) {
        // This check is specific and safe
        throw new BadRequestException(`Validation failed: ${error.message}`);
      }

      // Check for duplicate key errors directly
      let isDuplicateUpdateError = false;
      // Verify it's an object and has 'code' before trying to access
      if (typeof error === 'object' && error !== null && 'code' in error) {
        // Now that we know 'code' exists, access it using assertion
        if ((error as { code: unknown }).code === 11000) {
          isDuplicateUpdateError = true;
        }
      }

      if (isDuplicateUpdateError) {
        throw new BadRequestException(
          'Update failed due to duplicate property violation.',
        );
      }

      // Log and throw for other errors
      console.error(`Error updating social handle ${id}:`, error);
      throw error; // Re-throw other unexpected errors
    }

    // findByIdAndUpdate returns null if no document with the ID was found
    if (!updatedSocialHandle) {
      throw new NotFoundException(`Social Handle with ID "${id}" not found`);
    }
    return updatedSocialHandle;
  }

  async remove(id: string): Promise<SocialHandle> {
    let deletedSocialHandle: SocialHandleDocument | null;
    try {
      deletedSocialHandle = await this.socialHandleModel
        .findByIdAndDelete(id)
        .exec();
    } catch (error: unknown) {
      // Explicitly type error as unknown
      // Catch potential CastError if ID format is invalid
      if (error instanceof MongooseError.CastError) {
        // This check is specific and safe
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
      console.error(`Error removing social handle ${id}:`, error);
      throw error; // Re-throw other unexpected errors
    }

    // findByIdAndDelete returns null if no document with the ID was found
    if (!deletedSocialHandle) {
      throw new NotFoundException(`Social Handle with ID "${id}" not found`);
    }
    return deletedSocialHandle; // Return the deleted document as confirmation
  }
}
