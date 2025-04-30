import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { Interest, InterestDocument } from './entities/interest.entity';

@Injectable()
export class InterestsService {
  constructor(
    @InjectModel(Interest.name) private interestModel: Model<InterestDocument>,
  ) {}

  async create(createInterestDto: CreateInterestDto): Promise<Interest> {
    console.log('--- INTEREST CREATE ---');
    console.log('Received DTO:', createInterestDto);
    // iconPath will be undefined if not provided, which is fine for the optional schema field
    const createdInterest = new this.interestModel(createInterestDto);
    const savedInterest = await createdInterest.save();
    console.log('Saved Interest:', savedInterest);
    return savedInterest.toObject() as Interest; // Use .toObject() for plain JS object if needed downstream
  }

  async findAll(): Promise<Interest[]> {
    console.log('--- INTEREST FIND ALL ---');
    const interests = await this.interestModel
      .find()
      .sort({ position: 1 })
      .lean() // Use .lean() for better performance if only reading data
      .exec();
    console.log(`Found ${interests.length} interests.`);
    return interests;
  }

  async findOne(id: string): Promise<Interest> {
    console.log(`--- INTEREST FIND ONE ---`);
    console.log(`Attempting to find document with ID: [${id}]`);

    if (!Types.ObjectId.isValid(id)) {
      console.error(`Invalid ObjectId format for ID: [${id}]`);
      throw new NotFoundException(`Invalid ID format: "${id}"`);
    }

    // Use .lean() if you don't need a Mongoose document instance
    const interest = await this.interestModel.findById(id).lean().exec();

    if (!interest) {
      console.error(`Interest Document with ID [${id}] NOT FOUND.`);
      throw new NotFoundException(`Interest with ID "${id}" not found`);
    }
    console.log(`Interest Document with ID [${id}] FOUND:`, interest);
    return interest as Interest; // Cast if using lean()
  }

  async update(
    id: string,
    updateInterestDto: UpdateInterestDto,
  ): Promise<Interest> {
    console.log(`--- INTEREST UPDATE START ---`);
    console.log(`Attempting to update document with ID: [${id}]`);

    if (!Types.ObjectId.isValid(id)) {
      console.error(`Invalid ObjectId format for ID: [${id}]`);
      throw new NotFoundException(`Invalid ID format for update: "${id}"`);
    }

    // findByIdAndUpdate handles non-existence implicitly, but pre-check is fine too.
    // Using { new: true } returns the updated document or null if not found.
    const updatedInterest = await this.interestModel
      .findByIdAndUpdate(id, updateInterestDto, { new: true })
      .lean() // Use lean if you just need the data
      .exec();

    console.log(`--- INTEREST UPDATE AFTERMATH ---`);
    if (!updatedInterest) {
      console.error(
        `findByIdAndUpdate returned NULL for ID: [${id}]. Document likely doesn't exist. Throwing NotFoundException.`,
      );
      throw new NotFoundException(
        `Interest with ID "${id}" not found for update.`,
      );
    }

    console.log(
      `findByIdAndUpdate SUCCESS. Returned updated document:`,
      updatedInterest,
    );
    return updatedInterest as Interest; // Cast if using lean()
  }

  // Changed return type to Promise<void>
  async remove(id: string): Promise<void> {
    console.log(`--- INTEREST REMOVE ---`);
    console.log(`Attempting to delete document with ID: [${id}]`);

    if (!Types.ObjectId.isValid(id)) {
      console.error(`Invalid ObjectId format for ID: [${id}]`);
      throw new NotFoundException(`Invalid ID format for delete: "${id}"`);
    }

    const result = await this.interestModel.deleteOne({ _id: id }).exec();
    console.log('Deletion result:', result);

    if (result.deletedCount === 0) {
      console.error(
        `Interest Document with ID [${id}] NOT FOUND for deletion.`,
      );
      throw new NotFoundException(
        `Interest with ID "${id}" not found for deletion.`,
      );
    }

    console.log(`Interest Document with ID [${id}] successfully deleted.`);
    // No return value needed for Promise<void>
  }
}
