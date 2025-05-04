// src/users/users.service.ts
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

// Define the shape of data expected by findOrCreateByClerkId
interface ClerkUserData {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string; // Added profile image URL
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name); // Logger instance

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // --- Standard CRUD Operations ---

  // Create a new user using the DTO
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    this.logger.log(`Creating a new user with email: ${createUserDto.email}`);
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  // Retrieve all users
  async findAll(): Promise<UserDocument[]> {
    this.logger.log('Retrieving all users');
    return this.userModel.find().exec();
  }

  // Find a single user by their MongoDB _id
  async findOne(id: string): Promise<UserDocument> {
    this.logger.log(`Finding user by MongoDB ID: ${id}`);
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      this.logger.warn(`User with ID "${id}" not found`);
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  // Find a single user by their Clerk ID
  async findOneByClerkId(clerkId: string): Promise<UserDocument | null> {
    this.logger.log(`Finding user by Clerk ID: ${clerkId}`);
    const user = await this.userModel.findOne({ clerkId }).exec();
    if (!user) {
      this.logger.log(`User with Clerk ID "${clerkId}" not found.`);
    }
    return user;
  }

  // Update a user by their MongoDB _id using the DTO
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    this.logger.log(`Updating user with MongoDB ID: ${id}`);
    const existingUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true }) // {new: true} returns the updated document
      .exec();
    if (!existingUser) {
      this.logger.warn(`User with ID "${id}" not found for update`);
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    this.logger.log(`User with ID "${id}" updated successfully.`);
    return existingUser;
  }

  // Remove a user by their MongoDB _id
  async remove(id: string): Promise<{ deleted: boolean; id: string }> {
    this.logger.log(`Attempting to delete user with MongoDB ID: ${id}`);
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      this.logger.warn(`User with ID "${id}" not found for deletion`);
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    this.logger.log(`User with ID "${id}" deleted successfully.`);
    // Mongoose findByIdAndDelete returns the deleted document or null
    return { deleted: true, id };
  }

  // --- Clerk Integration Method ---

  // Find a user by Clerk ID, create if not found, optionally update if found
  async findOrCreateByClerkId(userData: ClerkUserData): Promise<UserDocument> {
    const { clerkId, email, firstName, lastName, profileImageUrl } = userData; // Destructure all properties

    let user = await this.userModel.findOne({ clerkId }).exec();

    if (!user) {
      this.logger.log(`Creating new user for Clerk ID: ${clerkId}`);
      // Create new user with all available data from Clerk token
      user = await this.userModel.create({
        clerkId,
        email,
        firstName,
        lastName,
        profileImageUrl, // Include profile image URL on creation
      });
      this.logger.log(
        `New user created with ID: ${user.clerkId} for Clerk ID: ${clerkId}`,
      );
    } else {
      // User exists, check if data needs synchronization
      this.logger.log(
        `User found for Clerk ID: ${clerkId}. Checking for potential updates.`,
      );
      let needsUpdate = false;
      const updatePayload: Partial<User> = {}; // Use Partial<User> for type safety

      // Check and stage updates for each relevant field
      if (email && user.email !== email) {
        updatePayload.email = email;
        needsUpdate = true;
        this.logger.log(`Staging email update for Clerk ID: ${clerkId}`);
      }
      if (firstName !== undefined && user.firstName !== firstName) {
        // Check for undefined to allow clearing name
        updatePayload.firstName = firstName;
        needsUpdate = true;
        this.logger.log(`Staging firstName update for Clerk ID: ${clerkId}`);
      }
      if (lastName !== undefined && user.lastName !== lastName) {
        // Check for undefined
        updatePayload.lastName = lastName;
        needsUpdate = true;
        this.logger.log(`Staging lastName update for Clerk ID: ${clerkId}`);
      }
      if (
        profileImageUrl !== undefined &&
        user.profileImageUrl !== profileImageUrl
      ) {
        // Check for undefined
        updatePayload.profileImageUrl = profileImageUrl;
        needsUpdate = true;
        this.logger.log(
          `Staging profileImageUrl update for Clerk ID: ${clerkId}`,
        );
      }

      // Perform update only if necessary
      if (needsUpdate) {
        this.logger.log(`Updating existing user data for Clerk ID: ${clerkId}`);
        // Use findByIdAndUpdate for atomicity and return updated doc
        user = await this.userModel
          .findByIdAndUpdate(user._id, updatePayload, { new: true })
          .exec();
        if (!user) {
          // Handle rare edge case: user deleted between findOne and findByIdAndUpdate
          this.logger.error(
            `User with Clerk ID ${clerkId} disappeared during update process.`,
          );
          throw new NotFoundException(
            `User with Clerk ID ${clerkId} disappeared during update.`,
          );
        }
        this.logger.log(
          `User data updated successfully for Clerk ID: ${clerkId}`,
        );
      } else {
        this.logger.log(
          `No data update needed for user with Clerk ID: ${clerkId}.`,
        );
      }
    }
    return user; // Return the found, created, or updated user document
  }
}
